// Icon imports - using SVGR to import as React components
import BellIcon from './bell.svg?react';
import BankIcon from './bank.svg?react';
import CameraIcon from './camera.svg?react';
import ReceiptIcon from './receipt.svg?react';
import CoinsIcon from './coins.svg?react';
import MobileIcon from './mobile.svg?react';
import UsbIcon from './usb.svg?react';
import CreditCardPlusIcon from './credit-card-plus.svg?react';
import WaterDropIcon from './water-drop.svg?react';
import PayPalIcon from './paypal.svg?react';
import PlusIcon from './plus.svg?react';
import CloseIcon from './close.svg?react';
import SearchIcon from './search.svg?react';
import EditIcon from './edit.svg?react';
import TrashIcon from './trash.svg?react';

// Icon registry
export const iconRegistry = {
  bell: BellIcon,
  bank: BankIcon,
  camera: CameraIcon,
  receipt: ReceiptIcon,
  coins: CoinsIcon,
  mobile: MobileIcon,
  usb: UsbIcon,
  'credit-card-plus': CreditCardPlusIcon,
  'water-drop': WaterDropIcon,
  paypal: PayPalIcon,
  plus: PlusIcon,
  close: CloseIcon,
  search: SearchIcon,
  edit: EditIcon,
  trash: TrashIcon,
} as const;

// Icon name type
export type IconName = keyof typeof iconRegistry;

// Export individual icons
export {
  BellIcon,
  BankIcon,
  CameraIcon,
  ReceiptIcon,
  CoinsIcon,
  MobileIcon,
  UsbIcon,
  CreditCardPlusIcon,
  WaterDropIcon,
  PayPalIcon,
  PlusIcon,
  CloseIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
};
