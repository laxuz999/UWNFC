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
  designA: DesignConfiguration; // A面
  designB: DesignConfiguration; // B面
}

export enum View {
  DESIGN,
  CONFIRMATION,
  COMPLETION,
}

export enum ActiveSide {
  A = 'A',
  B = 'B',
}