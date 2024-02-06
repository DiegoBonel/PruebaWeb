import { LitElement, html, css} from "lit-element";
import { estilos } from "./styles";


export class Productos extends LitElement {

    
    static get styles() {
    
    }

    static get properties() {
        return {
            productos: {
                type: Array
            }
        }
    }

    constructor(){
        super();
        this.productos = [];
    }

    updated() {
        if(this.productos.length > 0){
            this.llenarTabla();
        }
    }


    llenarTabla(){
        const tablaBody = this.renderRoot.querySelector("#tablaBody");
        tablaBody.innerHTML = "";
        this.productos.forEach(producto => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
              <th scope="row">${producto.idproductos}</th>
              <td>${producto.titulo}</td>
              <td>${producto.descripcion}</td>
              <td>${this.formatoDinero(producto.precioUnitario)}</td>
              <td>${producto.existencias}</td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    formatoDinero(valor) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'MXN' 
        }).format(valor);
    }
    
    filtrarTabla(ev) {
        let filtro = ev.target.value;
        let tabla = this.renderRoot.querySelector("#tablaProductos")
        let filas = tabla.getElementsByTagName('tr');

        for (let i = 0; i < filas.length; i++) {
            let celda = filas[i].getElementsByTagName('td')[0];

            if(celda){
                if (celda.innerHTML.toUpperCase().indexOf(filtro.toUpperCase()) > -1) {
                    filas[i].style.display = "";
                } else {
                    filas[i].style.display = "none";
                }
            }
        }
        filas[0].style.display = "";   
        
    }

    render() {
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <link rel="stylesheet" href="node_modules/@fortawesome/fontawesome-free/css/all.min.css">
        <link rel="stylesheet" href="styles.css">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        <div class="row mt-4 mb-4">
            <div class="col">
                <label>
                    <i class="fa-solid fa-magnifying-glass"></i>
                    Buscar Artículo</label>
                <input
                    id="busqueda"
                    class="form-control w-25"
                    name="busqueda"
                    type="text"
                    @input=${(ev) => this.filtrarTabla(ev)}
                >
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="table-responsive tablaVentas">
                    <table class="table border border-4" id="tablaProductos">
                        <thead class="sticky-top">
                            <tr>
                                <th scope="col">Id Producto</th>
                                <th scope="col">Título</th>
                                <th scope="col">Descripción</th>
                                <th scope="col">Precio Unitario</th>
                                <th scope="col">Existencias</th>
                            </tr>
                        </thead>
                        <tbody
                            id="tablaBody"
                        >
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        `;
    }
}
customElements.define('productos-component', Productos);
