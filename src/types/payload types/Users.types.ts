export type UserPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "customer" | "admin";
};

export type UserUpdatePayload = Partial<UserPayload>;