import {css} from "lit-element"
export const estilos = css`
    body {
        font-family: "Century Gothic", sans-serif;
    }

    .btn {
        transition: none;
    }

    .btnMenu {
        background-color: transparent;
        border-radius: 0%;
        color:  black;
        font-size: 2vw;
    }

    .btnMenuActivado {
        color:  blue;
        border-bottom: 3px blue solid !important; 
    }

    .btnMenu:hover {
        color: blue;
    }



    .btnNoti {
        color:  blue;
        font-size: 1vw;
        font-weight: bold;
    }

    .btnMenu i {
        color: gray
    }

    .btnMenuActivado i{
        color:  blue;
    }

    .iconoNoti {
        font-size: 2vw;
    }
`;