export type Nullable<T> = T | null;
export type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

export type Barber = {
  id: string;
  name: string;
  services: Service[];
  weekdays: number[];
  officehours: {
    start: { hour: number; minute: number };
    end: { hour: number; minute: number };
  }[];
};
