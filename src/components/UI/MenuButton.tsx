import { GiHamburgerMenu } from "react-icons/gi";
import { BsPersonCircle } from "react-icons/bs";

const MenuButton = () => {
    return (
        <button>
            <GiHamburgerMenu size={25}/>
            <BsPersonCircle size={25}/>
        </button>
    );
}

export default MenuButton;