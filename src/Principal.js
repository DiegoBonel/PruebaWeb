import { LitElement, html} from "lit-element";
import "./Ventas";
import "./Productos"


export class Principal extends LitElement {

    
    static get styles() {
    
    }

    static get properties() {
        return {
            botonActivo: {
                type: Element
            },
            ventasData: {
                type: Array
            },
            productosData: {
                type: Array
            },
            nombresProductos: {
                type: Array
            },
            vistaActiva: {
                type: Element
            }
        }
    }

    constructor(){
        super();
        this.botonActivo = null;
        this.ventasData = [];
        this.productosData = [];
        this.nombresProductos = [];
        this.vistaActiva = null
    }

    createRenderRoot() {
        return this;
    }

    async firstUpdated(){
        this.botonActivo = this.renderRoot.querySelector("#btnVentas");
        this.botonActivo.classList.toggle('btnMenuActivado');
        await this.getVentasProducto();
        await this.getProductos();
        this.vistaActiva = this.ventasTemplate;
        this.gestionarNotificaciones();
        
    }

    get ventasTemplate(){
        return html`
        <ventas-component
            class="mx-auto"
            .ventas=${this.ventasData}
            .productos=${this.nombresProductos}
        ></ventas-component>
        `;
    }

    get productosTemplate() {
        return html `
        <productos-component
            .productos=${this.productosData}
        >   
        </productos-component>
        `
    }



    async getVentasProducto(){
        const url = "https://localhost:7003/api/VentaProducto/getAll"
        await fetch(url)
        .then(response => {
            if (!response.ok) {
            throw new Error(`Error al obtener los datos. Código de estado: ${response.status}`);
            }
            
            return response.json();
        })
        .then(data => {
            this.ventasData = data;
        })
        .catch(error => {
            console.error('Error de red:', error);
            Swal.fire({
                title: 'Error de red',
                text: error,
                icon: 'error',
                confirmButtonText: 'Cerrar'
              });
        });
    }

    async getProductos(){
        const url = "https://localhost:7003/api/Producto/getAll"
        await fetch(url)
        .then(response => {
            if (!response.ok) {
            throw new Error(`Error al obtener los datos. Código de estado: ${response.status}`);
            }
            
            return response.json();
        })
        .then(data => {
            this.productosData = data;
            this.obtenerNombresProductos();
        })
        .catch(error => {
            console.error('Error de red:', error);
        });
    }

    obtenerNombresProductos() {
        this.nombresProductos = this.productosData.map((elemento) => elemento.titulo);
    }

    activarBoton(ev) {
        if(ev.target != this.botonActivo){
            const boton = ev.target;
            this.botonActivo.classList.toggle('btnMenuActivado');
            this.botonActivo = boton;
            boton.classList.toggle('btnMenuActivado');
        }
        this.cambiarVista(ev.target.name);
    }
       
    cambiarVista(btnNombre) {
        if(btnNombre == "btnVentas"){
            this.vistaActiva = this.ventasTemplate;
        }
        else if ( btnNombre == "btnProductos") {
            this.vistaActiva = this.productosTemplate;
        }
    }

    async recargar(){
        await this.getVentasProducto();
        await this.getProductos();
        this.cambiarVista(this.botonActivo.name);
        this.gestionarNotificaciones();
    }


    gestionarNotificaciones() {
        let productosStockBajo = this.productosData.filter((producto) => producto.existencias < 100);
        const panelNotificaciones = this.renderRoot.querySelector("#canvaBody");
        const btnNotificacion = this.renderRoot.querySelector("#btnNotificacion");
        panelNotificaciones.innerHTML = "";
        btnNotificacion.innerHTML = `<i class="fa-regular fa-bell iconoNoti"></i></i>`;

        if(productosStockBajo.length > 0){
            const notificacionLabel = document.createElement('label');
            notificacionLabel.classList.add("notificacion");
            notificacionLabel.textContent = "• Stock bajo, realizar pedido de los siguientes productos:"
            
            
            panelNotificaciones.appendChild(notificacionLabel);
            btnNotificacion.innerHTML = `<i class="fa-regular fa-bell iconoNoti"></i></i> 1`;

            productosStockBajo.forEach(producto => {
                let productoLabel = document.createElement('label');
                productoLabel.textContent = "- "+producto.titulo;
                productoLabel.classList.add("labelProducto");
                panelNotificaciones.appendChild(productoLabel);
            });
        }
    }

    render() {
        return html`
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <link rel="stylesheet" href="node_modules/@fortawesome/fontawesome-free/css/all.min.css">
        <link rel="stylesheet" href="styles.css">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
        <div class="container-fluid m-0 w-auto">
            <div class="offcanvas offcanvas-start panelNotificaciones" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div class="offcanvas-header">
                    <h4 class="offcanvas-title align-items-center" style="color: white; text-align: center" id="offcanvasExampleLabel">Notificaciones</h4>
                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body" id="canvaBody">
                </div>
            </div>
            <div class="row">
                <div class="col justify-content-start">   
                    <button 
                        id="btnNotificacion"
                        class="btn btnNoti"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasExample"
                        aria-controls="offcanvasExample"
                    >
                        <i class="fa-regular fa-bell iconoNoti"></i>
                    </button>
                    <button 
                        class="btn btnMenu"
                        type="button"
                        id="btnVentas"
                        name="btnVentas"
                        @click=${(ev) => this.activarBoton(ev)}
                    >
                        <i class="fa-solid fa-money-check-dollar"> </i>
                        Ventas
                    </button>
                    <button
                        class="btn btnMenu"
                        type="button"
                        id="btnProductos"
                        name="btnProductos"
                        @click=${(ev) => this.activarBoton(ev)}
                    >
                        <i class="fa-solid fa-spray-can-sparkles"></i>
                        Productos
                    </button>
                </div>
                <div class="col d-flex justify-content-end">
                    <button
                        class="btn iconoRefrescar"
                        type="button"
                        id="btnRefrescar"
                        name="btnRefrescar"
                        @click=${() => this.recargar()}
                    >
                        <i class="fa-solid fa-rotate-right"></i>
                    </button>
                </div>
            </div>
            <hr class="m-0"></hr>
            <div class="row">
                <div class="col-2 notificaciones">
                    queso
                </div>
                <div class="col mx-auto">
                    ${this.ventasData.length ? this.vistaActiva : ""}
                </div>
            </div> 
        </div>
        `;
    }
}
customElements.define('principal-component', Principal);
