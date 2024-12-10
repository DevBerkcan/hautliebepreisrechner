"use client";
import React, { useState } from "react";
import Navbar from "./Navbar";
import poppins from "@/app/fonts/fonts";
// import { useRouter } from "next/navigation";
// import PayPalButton from "./PayPalButton";
import {
  Category,
  Gender,
  PRICING_TYPE,
  SELECTED_TYPE,
  Treatment,
} from "@/app/types/types";
import { pricingData } from "@/app/data";
import Link from "next/link";

const Home = () => {
  const [gender, setGender] = useState<Gender>("Frau");
  const [selectedTreatment, setSelectedTreatment] =
    useState<string>("Haarentfernung");
  const [selectedPricingType, setSelectedPricingType] =
    useState<PRICING_TYPE>("Area1");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<SELECTED_TYPE[]>([]);

  // const router = useRouter();

  const getPricingHeaders = (treatmentData: Category): string[] => {
    const headers = new Set<string>();

    Object.keys(treatmentData).forEach((area) => {
      treatmentData[area].forEach((treatment) => {
        Object.keys(treatment.pricing).forEach((header) => {
          headers.add(header);
        });
      });
    });

    return Array.from(headers);
  };

  //handle payment success
  // const handleSuccess = (details: any) => {
  //   console.log(details);

  //   router.push("/success");
  // };

  // Render Pricing Rows

  const updatePricing = (
    selectedItems: SELECTED_TYPE[],
    selectedPricingType: string
  ) => {
    return selectedItems.map((item) => {
      const pricingValueString =
        selectedPricingType === "Area5"
          ? "ab 5 Areale"
          : selectedPricingType === "Area3"
          ? "ab 3 Areale"
          : "Einzelpreis pro Behandlung";

      return {
        ...item,
        price:
          item.treatment.pricing[pricingValueString] ||
          item.treatment.pricing["Einzelpreis pro Behandlung"] ||
          item.treatment.pricing["Kurspreis"],
      };
    });
  };

  const addItemToCart = (treatment: Treatment, area: string) => {
    const selectedItemLength = selectedItems.length;

    // Check if the item already exists
    const exists = selectedItems.find((item) => {
      return (
        item.area === area &&
        item.selectedTreatment === selectedTreatment &&
        item.treatment.name === treatment.name &&
        (selectedTreatment !== "courses" ? item.gender === gender : true)
      );
    });

    // If the item exists, remove it
    if (exists) {
      setSelectedItems((prev) => {
        const updatedItems = prev.filter(
          (item) =>
            !(
              item.area === exists.area &&
              item.gender === exists.gender &&
              item.selectedTreatment === exists.selectedTreatment &&
              item.treatment.name === exists.treatment.name
            )
        );

        const newCondition =
          updatedItems.length >= 5
            ? "Area5"
            : updatedItems.length >= 3
            ? "Area3"
            : "Area1";

        if (newCondition !== selectedPricingType) {
          const updatedItemsWithPricing = updatePricing(
            updatedItems,
            newCondition
          );
          return updatedItemsWithPricing;
        }
        return updatedItems;
      });
      return;
    }

    // Define new item to be added
    const newItem = {
      gender,
      area,
      treatment,
      selectedTreatment,
      price:
        treatment.pricing[
          selectedPricingType === "Area5"
            ? "ab 5 Areale"
            : selectedPricingType === "Area3"
            ? "ab 3 Areale"
            : "Einzelpreis pro Behandlung"
        ] || treatment.pricing["Kurspreis"],
    };

    // Add new item based on current selected item count
    let newPricingType: string;
    if (selectedItemLength + 1 >= 5) {
      newPricingType = "Area5";
    } else if (selectedItemLength + 1 >= 3) {
      newPricingType = "Area3";
    } else {
      newPricingType = "Area1";
    }

    setSelectedItems((prev) => {
      const updatedItems = [...prev, newItem];
      setSelectedPricingType(newPricingType as PRICING_TYPE);

      const updatedItemsWithPricing = updatePricing(
        updatedItems,
        newPricingType
      );
      return updatedItemsWithPricing;
    });
  };

  const renderPricing = (treatmentData: Category, pricingHeaders: string[]) => {
    return Object.keys(treatmentData).map((area) => (
      <div
        className="flex items-center align-middle justify-center w-[94vw] gap-4 py-5 p-10"
        key={area}
      >
        {/* Left Side - Area Names */}
        <div className="flex-1 w-5/12">
          <h4 className="font-semibold text-lg ml-2 mb-2">{area}</h4>
          {treatmentData[area].map((treatment: Treatment) => (
            <div key={treatment.name} className="flex items-center gap-4 ml-5">
              <label className="flex">
                <input
                  type="checkbox"
                  checked={selectedItems.some(
                    (item) =>
                      item.gender === gender &&
                      item.area === area &&
                      item.treatment.name === treatment.name &&
                      item.selectedTreatment === selectedTreatment
                  )}
                  onChange={() => addItemToCart(treatment, area)}
                />
                <p className="flex ml-2">{treatment.name}</p>
              </label>
              {/* <p>{treatment.name}</p> */}
            </div>
          ))}
        </div>

        {/* Right Side - Pricing Columns */}
        <div className="flex w-7/12 gap-4 justify-end">
          {pricingHeaders.map((header) => (
            <div className="flex flex-col items-center w-1/3" key={header}>
              <div className="font-semibold opacity-0 mb-2">.</div>
              {treatmentData[area]?.map((treatment: Treatment) => (
                <div
                  className="text-center"
                  key={`${treatment.name}-${header}`}
                >
                  {treatment.pricing[header] ? (
                    <p>${treatment.pricing[header]}</p>
                  ) : (
                    <p>-</p> // Placeholder for missing pricing
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  // Function to add or remove selected treatment from the cart
  // const addItemToCart = (treatment: Treatment, area: string) => {
  //   const calculatePrice = (
  //     treatment: Treatment,
  //     itemCount: number
  //   ): number => {
  //     if (itemCount >= 5) {
  //       return (
  //         treatment.pricing["ab 5 Areale"] ||
  //         treatment.pricing["Einzelpreis pro Behandlung"]
  //       );
  //     } else if (itemCount >= 3) {
  //       return (
  //         treatment.pricing["ab 3 Areale"] ||
  //         treatment.pricing["Einzelpreis pro Behandlung"]
  //       );
  //     } else {
  //       return treatment.pricing["Einzelpreis pro Behandlung"];
  //     }
  //   };

  //   setSelectedItems((prevItems) => {
  //     const selectedItem = {
  //       gender,
  //       area,
  //       treatmentName: treatment.name,
  //       price: 0,
  //       selectedTreatment,
  //     };

  //     // Check if the item already exists in the selectedItems
  //     const exists = prevItems.some(
  //       (item) =>
  //         item.gender === selectedItem.gender &&
  //         item.area === selectedItem.area &&
  //         item.treatmentName === selectedItem.treatmentName &&
  //         item.selectedTreatment === selectedItem.selectedTreatment
  //     );

  //     let updatedItems;
  //     if (exists) {
  //       // If it exists, remove it from the cart
  //       return prevItems.filter(
  //         (item) =>
  //           !(
  //             item.gender === selectedItem.gender &&
  //             item.area === selectedItem.area &&
  //             item.treatmentName === selectedItem.treatmentName &&
  //             item.selectedTreatment === selectedItem.selectedTreatment
  //           )
  //       );
  //     } else {
  //       // Add the item
  //       updatedItems = [...prevItems, selectedItem];
  //     }

  //     // Update the price for all items based on the new count
  //     const updatedItemCount = updatedItems.length;

  //     // updatedItems = updatedItems.map((item) => {
  //     //   const treatmentList =
  //     //     pricingData[item.gender]?.[item.selectedTreatment] || [];

  //     //   const matchingTreatment = treatmentList.find(
  //     //     (t: Treatment) => t.name === item.treatmentName
  //     //   );

  //     //   return {
  //     //     ...item,
  //     //     price: matchingTreatment
  //     //       ? calculatePrice(matchingTreatment, updatedItemCount)
  //     //       : 0, // Default to 0 if no matching treatment is found
  //     //   };
  //     // });

  //     return updatedItems;
  //   });
  // };

  const calculateTotal = () => {
    const subtotal = selectedItems.reduce(
      (total, item) => total + item.price,
      0
    );
    const discount = discountPercent * subtotal * 0.01;

    const tax = 0.2 * (subtotal - discount);
    const total = subtotal - discount + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotal();

  // Selected Treatment Data
  const selectedData = pricingData[gender]; // Filter by gender
  const selectedTreatmentData = selectedData[selectedTreatment]; // Filter by treatment

  // Determine pricing headers for selected treatment
  const pricingHeaders = getPricingHeaders(selectedTreatmentData);

  return (
    <div className="w-full bg-gray-50 text-white overflow-hidden">
      <Navbar />
      <div className="flex justify-between px-5 mb-4">
        <div className=" flex gap-4 ">
          {["Frau", "Mann"].map((g) => (
            <button
              key={g}
              onClick={() => setGender(g as Gender)}
              className={`px-6 py-2 rounded-md font-medium ${
                gender === g
                  ? "bg-[#007A89] text-white"
                  : "bg-gray-200 text-[#007A89]"
              } hover:shadow-md`}
            >
              {g}
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-solid border-main-color text-sm text-main-color hover:bg-gray-100"
          onClick={() => {
            setSelectedItems([]);
            setDiscountPercent(0);
          }}
        >
          Zurücksetzen
        </button>
      </div>
      <div className="flex flex-col justify-center align-middle items-center ">
        <div className="flex gap-4 mb-6 flex-wrap px-5">
          {Object.keys(pricingData[gender]).map((treatmentType) => (
            <button
              key={treatmentType}
              onClick={() => setSelectedTreatment(treatmentType)}
              className={`px-4 py-2 border border-solid border-gray-300 bg-blue-500 shadow-md hover:shadow-lg transition-shadow ${
                selectedTreatment === treatmentType
                  ? "bg-main-color text-white"
                  : "bg-gray-50 text-main-color"
              } rounded-md`}
            >
              {treatmentType}
            </button>
          ))}
        </div>

        {/* Pricing Table */}
        <div className="flex flex-col items-center align-middle justify-center w-[94vw] gap-4 py-5 p-2 md:p-10 bg-gray-800 rounded-lg shadow-[2px_4px_3px_rgba(150,150,150,0.5)]">
          {/* Pricing Headers */}
          <div className="flex flex-row gap-4 w-full items-center justify-between">
            <div className="flex-1 w-5/12 opacity-0">.</div>
            <div className="flex w-7/12 gap-4 h-full justify-end">
              {pricingHeaders.map((header) => (
                <h5
                  className={`overflow-clip font-semibold font-600 text-center w-1/3 bg-green-800 rounded-b rounded-t-3xl py-4 ${poppins.className}`}
                  key={header}
                >
                  {header}
                </h5>
              ))}
            </div>
          </div>

          {/* Pricing Rows */}
          <div className="flex flex-col items-center w-[100vw]">
            {renderPricing(selectedTreatmentData, pricingHeaders)}
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="mt-6 px-2 md:p-4 border-t-2 bg-slate-600 h-[30vh] overflow-y-scroll">
        <h3 className="font-semibold text-lg">Your Order Summary</h3>
        <div className="mt-4">
          {selectedItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <p>{`${item.gender}-${item.selectedTreatment} - ${item.treatment.name} (${item.area}) `}</p>
              <p>${item.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex justify-between">
            <p>Subtotal:</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Discount percentage:</p>
            <div>
              <label htmlFor="discountInput">
                <input
                  type="number"
                  id="discountInput"
                  className="text-gray-800"
                  value={discountPercent}
                  step={0.1}
                  min={0}
                  max={100}
                  onChange={(e) => {
                    const input = e.target.value;

                    if (input === "") {
                      setDiscountPercent(0);
                      return;
                    }

                    const value = parseFloat(input);
                    if (value < 0 || value > 100) {
                      return;
                    }

                    setDiscountPercent(value);
                  }}
                />
              </label>
            </div>
          </div>
          <div className="flex justify-between">
            <p>Tax:</p>
            <p>${tax.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-bold">
            <p>Total:</p>
            <p>${total.toFixed(2)}</p>
            {/* <PayPalButton
              amount={total.toFixed(2)}
              onSuccess={(details) => {
                console.log("Payment successful: ", details);
                handleSuccess(details);
              }}
            /> */}
          </div>
          <div className=" mt-4">
            <Link
              href="https://credit4beauty.de/"
              className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all"
            >
              credi4beauty
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
