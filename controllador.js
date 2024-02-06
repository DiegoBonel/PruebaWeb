const botonVentas = document.getElementById('btnVentas');
const botonProductos = document.getElementById('btnProductos');
let botonActivo = botonVentas;

botonVentas.addEventListener('click', function() {
    activarBoton(this);
});

botonProductos.addEventListener('click', function() {
    activarBoton(this);
    
});

function activarBoton(boton) {
    if(botonActivo != boton){
        botonActivo.classList.toggle('btnMenuActivado');
        botonActivo = boton;
        boton.classList.toggle('btnMenuActivado')
    }
}
