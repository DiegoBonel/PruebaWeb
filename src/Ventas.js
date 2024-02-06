import { LitElement, html, css} from "lit-element";
import { estilos } from "./styles";

export class Ventas extends LitElement {
    
    static get styles() {
    
    }

    static get properties() {
        return {
            ventas: {
                type: Array
            },
            productos: {
                type: Array
            }
        }
    }

    constructor(){
        super();
        this.ventas = [];
        this.productos = [];
    }

    updated() {
        if(this.ventas.length > 0){
            this.llenarTabla();
            this.llenarTablaTop();
            this.sumarVentas();
        }
        if(this.productos.length > 0){
            this.llenarCombobox();
        }
      }


    llenarTabla(){
        const tablaBody = this.renderRoot.querySelector("#tablaBody");
        tablaBody.innerHTML = "";
        this.ventas.forEach(venta => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
              <th scope="row">${venta.idVenta}</th>
              <td>${venta.nombreProducto}</td>
              <td>${venta.cantidadVendida}</td>
              <td>${moment(venta.fecha).locale('es').format("DD/MM/YYYY h:mm:ss ")}</td>
              <td>${this.formatoDinero(venta.totalVenta)}</td>
            `;
            tablaBody.appendChild(fila);
        });
    }

    llenarTablaTop(){
        const ventasAgrupadas = Object.groupBy(this.ventas, ( {nombreProducto}) => nombreProducto);

        const ventasSumadas = [];
        for (let key in ventasAgrupadas) {
            const sumaVentas = ventasAgrupadas[key].reduce((total, venta) => {
                return total + venta.cantidadVendida;
           }, 0);
            const producto = {
                nombreProducto: key,
                cantidadVendida: sumaVentas
            }
            ventasSumadas.push(producto);
        }

        ventasSumadas.sort((a, b) => b.cantidadVendida - a.cantidadVendida);

        const tablaBodyTop = this.renderRoot.querySelector("#tablaBodyTop");
        tablaBodyTop.innerHTML = "";
        ventasSumadas.forEach(venta => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
              <td>${venta.nombreProducto}</td>
              <td>${venta.cantidadVendida}</td>
            `;
            tablaBodyTop.appendChild(fila);
        });

        
    }

    llenarCombobox() {
        const combobox = this.renderRoot.querySelector("#productosCombo");
        this.productos.forEach((producto => {
            const option = document.createElement("option");
            option.text = producto;
            option.value = producto;
            combobox.add(option);
        }))
    }

    formatoDinero(valor) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'MXN' 
        }).format(valor);
    }

    filtrarTabla(ev) {
        let filtro = ev.target.value;
        let tabla = this.renderRoot.querySelector("#tablaVentas")
        let filas = tabla.getElementsByTagName('tr');

        if(filtro == "Todos"){
            for(let i = 0; i < filas.length; i++){
                filas[i].style.display = "";
            }
        }
        else{
            for (let i = 0; i < filas.length; i++) {
                let celdas = filas[i].getElementsByTagName('td');
                let mostrarFila = false;
    
                for (let j = 0; j < celdas.length; j++) {
                    let textoCelda = celdas[j].innerText || celdas[j].textContent;
    
                    if (textoCelda.indexOf(filtro) > -1) {
                    mostrarFila = true;
                    break;
                    }
                }
                filas[i].style.display = mostrarFila ? '' : 'none';
            }
            filas[0].style.display = "";   
        }
        this.sumarVentas();
        
    }

    mostrarTop(ev) {
        if(ev.target.checked){
            this.renderRoot.querySelector("#colTablaTop").style.display = "";
        }
        else{
            this.renderRoot.querySelector("#colTablaTop").style.display = "none";

        }
    }

    sumarVentas(){
        const seleccion = this.renderRoot.querySelector("#productosCombo").value;
        let totalSuma;
        if(seleccion == "Todos"){
            totalSuma = this.ventas.reduce((total, venta) => {
                return total + venta.totalVenta;
           }, 0);
        }
        else {
            let ventaFiltrada = this.ventas.filter((venta) => venta.nombreProducto == seleccion);
            totalSuma = ventaFiltrada.reduce((total, venta) => {
                return total + venta.totalVenta;
           }, 0);
        }
        const totalVentasBox = this.renderRoot.querySelector("#totalVentas");
        totalVentasBox.value=this.formatoDinero(totalSuma);
    }


    render() {
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <link rel="stylesheet" href="node_modules/@fortawesome/fontawesome-free/css/all.min.css">
        <link rel="stylesheet" href="styles.css">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        <div class="row mt-4 mb-4">
            <div class="col-2">
                <label>Filtrar por producto</label>
                <select 
                    id="productosCombo" 
                    class="combobox"
                    @change=${(ev) => this.filtrarTabla(ev)}
                >
                    <option value="Todos">Todos</option>
                </select>
            </div>
            <div class="col-10">
                <div class="form-check mt-3">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                        @change=${(ev) => this.mostrarTop(ev)}
                    >
                        <label class="form-check-label" for="flexCheckDefault">
                        Top de artículos vendidos
                    </label>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-4" id="colTablaTop" style="display: none">
                <h5>Top de Artículos</h5>
                <div class="table-responsive tablaTop">
                    <table class="table  border border-4" id="tablaTop">
                        <thead class="sticky-top">
                            <tr>
                                <th scope="col">Producto</th>
                                <th scope="col">Cantidad Total Vendida</th>
                            </tr>
                        </thead>
                        <tbody
                            id="tablaBodyTop"
                        >
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col">
                <div class="table-responsive tablaVentas">
                    <table class="table border border-4" id="tablaVentas">
                        <thead class="sticky-top">
                            <tr>
                                <th scope="col">Id Venta</th>
                                <th scope="col">Producto</th>
                                <th scope="col">Cantidad Vendida</th>
                                <th scope="col">Fecha Venta</th>
                                <th scope="col">Total de Venta</th>
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
        <div class="row mt-3">
            <div class="col d-flex justify-content-end">
                <label class="form-label mt-1 me-2" for="totalVentas">Total de ventas:</label>
                <input
                    id="totalVentas"
                    class="form-control w-25"
                    name="totalVentas"
                    type="text"
                    readonly
                >
            </div>
        </div>
        `;
    }
}

customElements.define('ventas-component', Ventas);
