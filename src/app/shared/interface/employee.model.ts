export interface employee {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  tesSalary: string;
  status: 'Permanent' | 'Contract';
  group: string;
  description: string;
  image: string;
}
