'use server';

import stepsJsonData from '../../public/data/customization-steps.json';
import Steps3dJsonData from '../../public/data/3d-customization-steps.json';
import productJsonData from '../../public/data/products.json';
import { Attribute, CustomizationSteps, CustomizationSteps3d, Product } from '../types/product';

export async function getSteps(): Promise<CustomizationSteps> {
  const data = stepsJsonData as CustomizationSteps;

  //set first option selected
  data.customizationSteps[0].attributes.map((el: Attribute) => {
    el.options[0].isSelected = true;
    el.selectedOption = el.options[0].code;

    return el;
  });

  return data;
}

export async function get3dSteps(): Promise<CustomizationSteps3d> {
  return Steps3dJsonData as CustomizationSteps3d;
}

export async function getProducts(): Promise<Product[]> {
  const data = productJsonData.items as Product[];

  //set first product selected
  return data.map((el: Product, idx: number) => {
    if (!('isSelected' in el)) el.isSelected = idx === 0 ? true : false;

    return el;
  });
}
