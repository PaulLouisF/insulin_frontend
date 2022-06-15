class Patient {
    id: number;
    first_name: string;
    last_name: string;
    is_man: boolean;
    birth_date: string;
  
    constructor(id: number, first_name: string, last_name: string, is_man: boolean, birth_date: string) {
      this.id = id;
      this.first_name = first_name;
      this.last_name = last_name;
      this.is_man = is_man;
      this.birth_date = birth_date
    }
  }
  
  export default Patient;