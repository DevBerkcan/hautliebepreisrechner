"use client";
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import poppins from "./fonts/fonts";

type Pricing = {
  [key: string]: number;
};

type Treatment = {
  name: string;
  pricing: Pricing;
};

type Category = {
  [treatmentName: string]: Treatment[]; // Maps treatment categories (e.g., "Kopf | Einzelbehandlung") to a list of treatments
};

type Service = {
  [categoryName: string]: Category; // Maps service types (e.g., "Haarentfernung") to treatment categories
};

type GenderPricingData = {
  [gender: string]: Service; // Maps genders (e.g., "Frau" or "Mann") to services
};

type Gender = "Frau" | "Mann";

const pricingData: GenderPricingData = {
  Frau: {
    Haarentfernung: {
      Kopf: [
        {
          name: "Gesicht",
          pricing: {
            "ab 5 Areale": 39,
            "ab 3 Areale": 49,
            "Einzelpreis pro Behandlung": 59,
          },
        },
        {
          name: "Oberlippe",
          pricing: {
            "ab 5 Areale": 19,
            "ab 3 Areale": 24,
            "Einzelpreis pro Behandlung": 29,
          },
        },
        {
          name: "Kinn",
          pricing: {
            "ab 5 Areale": 19,
            "ab 3 Areale": 24,
            "Einzelpreis pro Behandlung": 29,
          },
        },
      ],
      Oberkorper: [
        {
          name: "Oberarme",
          pricing: {
            "ab 5 Areale": 30,
            "ab 3 Areale": 49,
            "Einzelpreis pro Behandlung": 69,
          },
        },
        {
          name: "Unterarme",
          pricing: {
            "ab 5 Areale": 90,
            "ab 3 Areale": 59,
            "Einzelpreis pro Behandlung": 79,
          },
        },
      ],
    },
    Plasmabehandlung: {
      "Kopf | Einzelbehandlung": [
        {
          name: "Halsfältchen (pro Falte)",
          pricing: {
            "ab 5 Areale": 60,
            "ab 3 Areale": 80,
            "Einzelpreis pro Behandlung": 100,
          },
        },
        {
          name: "Kinnfalte",
          pricing: {
            "ab 5 Areale": 90,
            "ab 3 Areale": 110,
            "Einzelpreis pro Behandlung": 130,
          },
        },
        {
          name: "Krähenfüße",
          pricing: {
            "ab 5 Areale": 110,
            "ab 3 Areale": 130,
            "Einzelpreis pro Behandlung": 150,
          },
        },
      ],
      "Kopf | 3er Paket": [
        {
          name: "Halsfältchen (pro Falte)",
          pricing: {
            "ab 5 Areale": 0,
            "ab 3 Areale": 0,
            "Einzelpreis pro Behandlung": 249,
          },
        },
        {
          name: "Kinnfalte",
          pricing: {
            "ab 5 Areale": 0,
            "ab 3 Areale": 0,
            "Einzelpreis pro Behandlung": 339,
          },
        },
        {
          name: "Krähenfüße",
          pricing: {
            "ab 5 Areale": 0,
            "ab 3 Areale": 0,
            "Einzelpreis pro Behandlung": 399,
          },
        },
      ],
    },
  },
  Mann: {
    Haarentfernung: {
      "Kopf | Einzelbehandlung": [
        {
          name: "Halsfalten",
          pricing: {
            "ab 5 Areale": 50,
            "ab 3 Areale": 49,
            "Einzelpreis pro Behandlung": 10,
          },
        },
        {
          name: "Kinnfalte",
          pricing: {
            "ab 5 Areale": 90,
            "ab 3 Areale": 59,
            "Einzelpreis pro Behandlung": 10,
          },
        },
      ],
      Oberkorper: [
        {
          name: "Oberarme",
          pricing: {
            "ab 5 Areale": 60,
            "ab 3 Areale": 49,
          },
        },
        {
          name: "Unterarme",
          pricing: {
            "ab 5 Areale": 90,
            "ab 3 Areale": 59,
          },
        },
      ],
    },
    Plasmabehandlung: {
      "Kopf | Einzelbehandlung": [
        {
          name: "Halsfalten",
          pricing: {
            "ab 5 Areale": 60,
          },
        },
        {
          name: "Kinnfalte",
          pricing: {
            "ab 5 Areale": 90,
          },
        },
      ],
    },
  },
};

const Home = () => {
  const [gender, setGender] = useState<Gender>("Frau");
  const [selectedTreatment, setSelectedTreatment] =
    useState<string>("Haarentfernung");
  const [selectedItems, setSelectedItems] = useState<
    {
      gender: Gender;
      area: string;
      treatmentName: string;
      price: number;
      selectedTreatment: string;
    }[]
  >([]);

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
      price: treatment.pricing["Einzelpreis pro Behandlung"],
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
    const discount = 0.1 * subtotal; // 10% discount
    const tax = 0.2 * subtotal; // 20% tax
    const total = subtotal - discount + tax;
    return { subtotal, discount, tax, total };
  };

  const { subtotal, discount, tax, total } = calculateTotal();

  // Selected Treatment Data
  const selectedData = pricingData[gender]; // Filter by gender
  const selectedTreatmentData = selectedData[selectedTreatment]; // Filter by treatment

  // Determine pricing headers for selected treatment
  const pricingHeaders = getPricingHeaders(selectedTreatmentData);

  return (
    <div className="w-full bg-gray-50 text-white overflow-hidden">
      <Navbar />
      <div className="flex gap-4 mb-4">
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
      <div className="flex flex-col justify-center align-middle items-center ">
        <div className="flex gap-4 mb-6">
          {Object.keys(pricingData[gender]).map((treatmentType) => (
            <button
              key={treatmentType}
              onClick={() => setSelectedTreatment(treatmentType)}
              className={`px-4 py-2 border border-solid border-gray-300 bg-blue-500 shadow-md hover:shadow-lg transition-shadow text-white ${
                selectedTreatment === treatmentType
                  ? "bg-main-color"
                  : "bg-gray-50 text-main-color"
              } rounded-md`}
            >
              {treatmentType}
            </button>
          ))}
        </div>

        {/* Pricing Table */}
        <div className="flex flex-col items-center align-middle justify-center w-[94vw] gap-4 py-5 p-10 bg-gray-800 rounded-lg shadow-[2px_4px_3px_rgba(150,150,150,0.5)]">
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
      <div className="mt-6 p-4 border-t-2 bg-slate-600">
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
            <p>Discount:</p>
            <p>-${discount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Tax:</p>
            <p>${tax.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-bold">
            <p>Total:</p>
            <p>${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
