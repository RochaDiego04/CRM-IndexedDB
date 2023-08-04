(function(){
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });



    function validarCliente(e) {
        e.preventDefault();

        // Leer inputs
        nombre = document.querySelector('#nombre').value;
        email = document.querySelector('#email').value;
        telefono = document.querySelector('#telefono').value;
        empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // Crear un objeto con la informacion
        const cliente = {
            nombre, 
            email, 
            telefono, 
            empresa
        };
        cliente.id = Date.now();
        
        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'],'readwrite');
        
        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);

        transaction.onerror = () => {
            imprimirAlerta('Error al agregar cliente','error');
        }

        transaction.oncomplete = () => {
            imprimirAlerta('Cliente agregado con éxito');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }

})();