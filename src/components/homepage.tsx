"use client";
import React, { useState } from "react";
import Navbar from "./Navbar";
import poppins from "@/app/fonts/fonts";
// import { useRouter } from "next/navigation";
// import PayPalButton from "./PayPalButton";
import { Category, Gender, Treatment } from "@/app/types/types";
import { pricingData } from "@/app/data";

const Home = () => {
  const [gender, setGender] = useState<Gender>("Frau");
  const [selectedTreatment, setSelectedTreatment] =
    useState<string>("Haarentfernung");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<
    {
      gender: Gender;
      area: string;
      treatmentName: string;
      price: number;
      selectedTreatment: string;
    }[]
  >([]);

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
                      item.treatmentName === treatment.name &&
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
              {treatmentData[area].map((treatment) => (
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
  const addItemToCart = (treatment: Treatment, area: string) => {
    const selectedItem = {
      gender,
      area,
      treatmentName: treatment.name,
      price:
        treatment.pricing["Einzelpreis pro Behandlung"] ||
        treatment.pricing["Kurspreis"],
      selectedTreatment: selectedTreatment,
    };

    setSelectedItems((prevItems) => {
      // Check if the item already exists in the selectedItems
      const exists = prevItems.some(
        (item) =>
          item.gender === selectedItem.gender &&
          item.area === selectedItem.area &&
          item.treatmentName === selectedItem.treatmentName &&
          item.selectedTreatment === selectedItem.selectedTreatment
      );

      if (exists) {
        // If it exists, remove it from the cart
        return prevItems.filter(
          (item) =>
            !(
              item.gender === selectedItem.gender &&
              item.area === selectedItem.area &&
              item.treatmentName === selectedItem.treatmentName &&
              item.selectedTreatment === selectedItem.selectedTreatment
            )
        );
      } else {
        // If it doesn't exist, add it to the cart
        return [...prevItems, selectedItem];
      }
    });
  };

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
              <p>{`${item.gender}-${item.selectedTreatment} - ${item.treatmentName} (${item.area}) `}</p>
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
        </div>
      </div>
    </div>
  );
};

export default Home;
