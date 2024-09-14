export interface Product {
  sku: string;
  price: string;
  materialSku: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
  information: {
    title: string;
    description: string;
    maker: string;
    fineness: string;
    weight: string;
    color: string;
    pattern: string;
    season: string;
    composition: string;
    manufacturercode: string;
    compositiondescription: string;
    maps: {
      color: string;
      normal: string;
      roughness: string;
      specular: string;
    };
    mapsizewidth: number;
    mapsizeheight: number;
    mapcommoncolor: string;
  };
  isSelected?: boolean;
}

export interface CameraConfig {
  position: {
    x: number;
    y: number;
    z: number;
  };
  target: {
    x: number;
    y: number;
    z: number;
  };
  animation?: boolean;
}

export interface Option {
  id: number;
  code: string;
  name: string;
  description: string;
  image: string;
  imageType: string;
  isSelected: boolean;
  optionDisabled: number[] | null;
  value?: string;
}

export interface Attribute {
  attributeId: number;
  code: string;
  type: string;
  title: string;
  options: Array<Option>;
  selectedOption: any | null;
}

export type CustomizationSteps = {
  customizationSteps: Array<{
    attributes: Array<Attribute>;
  }>;
};

export type Attribute3d = {
  code: string;
  materialValue?: string | null;
  item?: string;
  maxLength?: number;
  cameraConfig?: CameraConfig;
};

export interface CustomizationSteps3d {
  customizationSteps: {
    cameraConfig: CameraConfig;
    attributes: Array<{
      code: string;
      material?: boolean;
      cameraConfig: CameraConfig | undefined;
      options: Array<Attribute3d>;
    }>;
  };
}
