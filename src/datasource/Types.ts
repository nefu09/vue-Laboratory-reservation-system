export interface Resule{
  code?: number;
  message?: string;
  data?: object;
}

export interface Role {
  id?: string;
  name?: string;
  userName?:String;
  authority?:number;
  password?:String;
}

export interface Laboratory{
  id?: string;
  name?: string;
  capacity?: number;
  description?: string;
}


export interface Course{
  id?: string;
  name?: string;
  studentNumber?: number;
  periods?: number;
}

export interface reservation{
  id?: string;
  teacherId?: string;
  courseId?: string;
  laboratoryId?: string;
  week?: number;
  day?: number;
  lesson?: number;
}

export interface Appointment{
  id?: number;
  uid?: number;
  uname?: string;
  cid?: number;
  cname?: string;
  labName?: string;
}

export interface CheckboxState{
  week: number;
  disabled: boolean;
}

export interface Day{
  day: string | number;
  checkboxs: CheckboxState[];
}

export interface Section{
  sectionId: number;
  days: Day[];
}
