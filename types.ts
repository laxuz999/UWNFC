export enum ProductType {
  KEYCHAIN = 'keychain',
  CARD = 'card',
}

export enum DesignSource {
  BLANK = 'blank',
  QR = 'qr',
  STORE = 'store',
  UPLOAD = 'upload',
}

export interface DesignConfiguration {
  source: DesignSource;
  qrColor: string;
  storeDesignUrl: string;
  uploadedFileUrl: string;
}

export interface Order {
  productType: ProductType;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  nfcUrl: string;
  frontDesign: DesignConfiguration;
  backDesign: DesignConfiguration;
}

export enum View {
  DESIGN,
  CONFIRMATION,
  COMPLETION,
}

export enum ActiveSide {
  FRONT = 'front',
  BACK = 'back',
}