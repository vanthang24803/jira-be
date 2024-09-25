interface IMember {
  _id: string;
  email: string;
  fullName: string;
  avatar: string;
  role: string;
  __v: number;
}

interface ITask {
  _id: string;
  name: string;
  type: string;
  description: string;
  code: string;
  level: string;
  status: string;
  reporter: {
    _id: string;
    email: string;
    fullName: string;
    avatar: string;
    role: string;
  };
  assignees: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type { IMember, ITask };
