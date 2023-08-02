(function(){
    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm',1);

        abrirConexion.onerror = function() {
            console.log('Hubo un error');
        }

        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
        }

    }

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

    function imprimirAlerta(mensaje, tipo) {
        const alerta = document.querySelector('.alerta');
        if(!alerta) {
            const divAlerta = document.createElement('DIV');
            
            divAlerta.classList.add('px-4', 'py-3','rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
            if(tipo === 'error'){
                divAlerta.classList.add('bg-red-100','border-red-400','text-red-700');
            }
            else {
                divAlerta.classList.add('bg-green-100','border-green-400','text-green-700');
            }
    
            divAlerta.textContent = mensaje;
    
            formulario.appendChild(divAlerta);
            
            setTimeout(() => {
               divAlerta.remove(); 
            }, 3000);
        }
    }

})();