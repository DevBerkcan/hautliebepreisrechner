"use client";
import React, { useState } from "react";
import Navbar from "./Navbar";
import {
  Gender,
  PRICING_TYPE,
  SELECTED_TYPE,
  Treatment,
} from "@/app/types/types";
import { pricingData } from "@/app/data";
import Footer from "./Footer";
import PricingTable from "./PricingTable";

const Home = () => {
  const [gender, setGender] = useState<Gender>("Frau");
  const [selectedTreatment, setSelectedTreatment] =
    useState<string>("Haarentfernung");
  const [selectedPricingType, setSelectedPricingType] =
    useState<PRICING_TYPE>("Area1");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [selectedItems, setSelectedItems] = useState<SELECTED_TYPE[]>([]);

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

  const calculateTotal = () => {
    const subtotal = selectedItems.reduce(
      (total, item) => total + item.price,
      0
    );
    const discount = discountPercent * subtotal * 0.01;

    const total = subtotal - discount;
    return { subtotal, total };
  };

  const { subtotal, total } = calculateTotal();

  return (
    <div className="w-full bg-gray-50 text-white overflow-hidden">
      <Navbar />
      <div className="flex justify-between flex-wrap gap-2 px-5 mb-4">
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
          className="flex items-center gap-2 px-4 py-2 rounded-md border border-solid bg-red-600 text-sm text-white hover:bg-red-500"
          onClick={() => {
            setSelectedItems([]);
            setDiscountPercent(0);
          }}
        >
          Zurücksetzen
        </button>
      </div>
      {/* <div className="flex  "> */}
      <div className="flex flex-row  px-5 align-middle items-center gap-4 mb-6 flex-wrap">
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

      <PricingTable
        selectedGender={gender}
        selectedTreatment={selectedTreatment}
        selectedItems={selectedItems}
        addItemToCart={addItemToCart}
      />
      {/* Payment Section */}
      <Footer
        selectedItems={selectedItems}
        subtotal={subtotal}
        discountPercent={discountPercent}
        setDiscountPercent={setDiscountPercent}
        total={total}
      />
    </div>
  );
};

export default Home;
