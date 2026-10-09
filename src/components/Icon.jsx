import {
  ShieldCheck, Fingerprint, WalletCards, Users, Wallet, MessageCircle, ShoppingCart,
  Bot, PlayCircle, ReceiptText, FileText, Route, Search, CircleHelp, Send, Youtube,
  Linkedin, Instagram, Facebook, Mail, Globe, Phone, MapPin, Bell, Check, Clock,
} from "lucide-react";

const map = {
  shield: ShieldCheck, id: Fingerprint, pay: WalletCards, users: Users,
  wallet: Wallet, chat: MessageCircle, cart: ShoppingCart, ai: Bot, play: PlayCircle,
  bill: ReceiptText, doc: FileText, road: Route, search: Search, faq: CircleHelp,
  telegram: Send, youtube: Youtube, linkedin: Linkedin, instagram: Instagram,
  facebook: Facebook, mail: Mail, globe: Globe, phone: Phone, pin: MapPin,
  bell: Bell, check: Check, clock: Clock,
};

function XGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21.5l-7.19 8.22L22.75 22h-6.6l-5.17-6.76L5.06 22H1.8l7.7-8.8L1.5 2h6.77l4.67 6.17L18.244 2Zm-1.16 18h1.8L7.03 3.9H5.1L17.084 20Z" />
    </svg>
  );
}

export default function Icon({ name, size = 20, ...rest }) {
  if (name === "x") return <XGlyph size={size} />;
  const C = map[name];
  return C ? <C size={size} strokeWidth={1.8} {...rest} /> : null;
}
