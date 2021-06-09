export interface ResultVO{
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
  teacherId:String;
  name?: string;
  studentNumber?: number;
  periods?: number;
  teacherName?:string;
}

export interface Reservation{
  id?: string;
  teacherId?: string;
  courseId?: string;
  laboratoryId?: string;
  week?: number;
  day?: number;
  lesson?: number;
}
 
export interface Location{
  lesson?:number;
  days?:Day[];
}


export interface Week{
  weekwhich?: number;
  disabled?: boolean;
}

export interface Day{
  daywhich?: number;
  weeks?: Week[];
}

export interface Choice{
  lesson?:number;
  day?:Day; 
}
