var box = document.getElementById("rsp");

var modo = document.getElementById("modo");
var colaborador = document.getElementById("colaborador");

modo.addEventListener("change", function () {
    if (modo.value == "1") {
        colaborador.disabled = true;
        document.getElementById("colaborador_usuario").disabled = true;
    } else {
        colaborador.disabled = false;
        document.getElementById("colaborador_usuario").disabled = false;
    }
});

function verificar(campo) {
    if (document.getElementById(campo).value != "") {
        document.getElementById(campo).classList.remove("is-invalid");
        document.getElementById(campo).classList.add("is-valid");
    } else {
        document.getElementById(campo).classList.remove("is-valid");
        document.getElementById(campo).classList.add("is-invalid");
        document.getElementById(campo).focus();
        Swal.fire({
            title: "Error",
            text: "El campo: " + capitalize(campo) + ", es obligatorio.",
            icon: "error",
            confirmButtonText: 'Ok'
        })
        return str;
    }
};

function get_value(campo) {
    return capitalize(document.getElementById(campo).value.trim());
};

function camello(control) {
    var autor = document.getElementById(control).value.toLowerCase().trim();
    var nueva = "";

    for (var i = 0; i < autor.length; i++) {
        if (i == 0) {
            nueva += autor[0].toUpperCase();
        } else {
            if (autor[i - 1] == " ") {
                nueva += autor[i].toUpperCase();
            } else {
                nueva += autor[i];
            }
        }
    }

    return nueva;
};

function capitalize(word) {
    word = word.toLowerCase();
    return word[0].toUpperCase() + word.slice(1);
};

function add(texto) {
    box.value += texto;
}

function if_exist(red, campo) {
    if (document.getElementById(campo).value != "") {
        add(red + document.getElementById(campo).value.toLowerCase().trim().replace(" ", "") + "\n\n")
        document.getElementById(campo).classList.add("is-valid");
    }
}

function write_names(tmp) {
    //AÑADIR NOMBRES UNO X UNO
    for (var x = 0; x < tmp.length; x++) {
        if (x == tmp.length - 1) {
            add(tmp[x]); //ULTIMO NOMBRE
        } else {
            add(tmp[x] + ", "); //SIGUE
        }
    }
};

function count_person(campo) {
    var cant = 1;
    for (var i = 0; i < campo.length; i++) {
        if (campo[i] == ",") {
            cant++;
        }
    }
    return cant;
}
//MARCAR AMBOS CAMPOS SI SON INCORRECTAS LAS CANTIDADES DE NOMBRES Y USUARIOS
function mark(control1, control2, property1, property2) {
    //CONTROL 2
    document.getElementById(control1).classList.remove(property1);
    document.getElementById(control2).classList.remove(property1);
    //CONTROL 2
    document.getElementById(control1).classList.add(property2);
    document.getElementById(control2).classList.add(property2);
}

function get_user(campo) {
    return document.getElementById(campo).value.toLowerCase();
};

function generar() {
    //control del resultado
    var titulo;
    var tipo;
    var autor;
    var autor_usuario;
    var colaborador;
    var colaborador_usuario;
    var more_ft = false;
    var more_at = false;
    var ft = false;
    var nombres_autores = [];
    var usuarios_autores = [];
    var nombres_colaboradores = [];
    var usuarios_colaboradores = [];
    var grabacion;
    var mezcla;

    //VERIFICACIONES PIRNCIPALES - NINGUN CAMPO VACIO
    verificar("titulo");
    verificar("autor");
    verificar("autor_usuario");

    if (document.getElementById("modo").value == "2") {
        verificar("colaborador");
        verificar("colaborador_usuario");
        ft = true;

        colaborador = camello("colaborador");
        colaborador_usuario = get_user("colaborador_usuario");
    }

    verificar("grabacion");
    verificar("mezcla");

    //OBTENER VALORES PRINCIPALES - VERIFICACIONES SECUNDARIAS
    titulo = document.getElementById("titulo").value.trim();
    tipo = get_value("tipo");
    autor = camello("autor");
    autor_usuario = get_user("autor_usuario");
    grabacion = get_user("grabacion");
    mezcla = get_user("mezcla");


    //SI HAY MAS DE 1 AUTOR
    if (autor.includes(",") || autor_usuario.includes(",")) {
        more_at = true;
        //VERIFICAR SI COINDICEN LA CANTIDAD DE AUTORES Y USUARIOS
        if (count_person(autor) != count_person(autor_usuario)) {
            mark("autor", "autor_usuario", "is-valid", "is-invalid");
            document.getElementById("autor").focus();

            Swal.fire({
                title: "Error",
                text: "La cantidad de autores y nombres de usuario no coinciden",
                icon: "error",
                confirmButtonText: 'Ok'
            })

            return str;
        } else {
            //SI COINCIDEN SE GUARDAN LOS DATOS
            nombres_autores = autor.split(",");
            for (var i = 0; i < nombres_autores.length; i++) {
                nombres_autores[i] = nombres_autores[i].trim();
            }
            usuarios_autores = autor_usuario.split(",");
            for (var i = 0; i < usuarios_autores.length; i++) {
                usuarios_autores[i] = usuarios_autores[i].trim().replace(" ", "");
            }
            mark("autor", "autor_usuario", "is-invalid", "is-valid");

        }
    }
    //HAY FT
    if (ft) {
        // SI HAY MAS DE 1 FT
        if (colaborador.includes(",") || colaborador_usuario.includes(",")) {
            more_ft = true;
            if (count_person(colaborador) != count_person(colaborador_usuario)) {
                mark("colaborador", "colaborador_usuario", "is-valid", "is-invalid");
                document.getElementById("colaborador").focus();

                Swal.fire({
                    title: "Error",
                    text: "La cantidad de autores y nombres de usuario no coinciden",
                    icon: "error",
                    confirmButtonText: 'Ok'
                })

                return str;
            } else {
                //SI COINCIDEN SE GUARDAN LOS DATOS
                nombres_colaboradores = colaborador.split(",");
                for (var i = 0; i < nombres_colaboradores.length; i++) {
                    nombres_colaboradores[i] = nombres_colaboradores[i].trim();
                }
                usuarios_colaboradores = colaborador_usuario.split(",");
                for (var i = 0; i < usuarios_colaboradores.length; i++) {
                    usuarios_colaboradores[i] = usuarios_colaboradores[i].trim().replace(" ", "");
                }
                mark("colaborador", "colaborador_usuario", "is-invalid", "is-valid");
            }
        }
    }

    //SI TODAS LAS VERIFICACIONES HAN LLEGADO HASTA AQUI, QUIERE DECIR QUE TODO ESTA OK
    //COMIENZA LA ESCRITURA DE DATOS

    box.value = ""; //LIMPIAR LA CAJA DE RESULTADOS

    //SI HAY MAS DE 1 AUTOR
    if (more_at) {
        write_names(nombres_autores);
    } else {
        //SOLO HAY 1 AUTOR
        add(autor);
    }
    add(" - " + titulo); //ESCRIBE TITULO

    //SI ES FT
    if (ft) {
        add(" ft. ");
        //SI HAY MAS DE UN COLABORADOR
        if (more_ft) {
            write_names(nombres_colaboradores);
        } else {
            //SI SOLO HAY UNO
            add(colaborador);
        }
    }

    //VIDEO O AUDIO OFICIAL
    add(" (" + tipo + ")\n\n");

    //SI HAY MENSAJE
    if (document.getElementById("mensaje").value != "") {
        add(capitalize(document.getElementById("mensaje").value) + "\n\n");
    }

    //PLATAFORMAS
    if (document.getElementById("spotify").value != "" || document.getElementById("otra").value != "") {
        add("► Escucha toda mi música en:\n");
        if (document.getElementById("spotify").value != "") {
            add("♪ " + document.getElementById("spotify").value.replace("www.", "") + "\n");
        }
        if (document.getElementById("otra").value != "") {
            add("♪ " + document.getElementById("otra").value.replace("www.", "") + "\n");
        }
        add("\n");
    }
    add("► Redes\n"); //REDES DE AUTOR Y COLABORADOR SI HAY

    //AUTOR(ES)
    if (more_at) {
        for (var i = 0; i < usuarios_autores.length; i++) {
            add("• " + nombres_autores[i] + ": " + "http://instagram.com/" + usuarios_autores[i] + "\n");
        }
    } else {
        add("• " + autor + ": " + "http://instagram.com/" + autor_usuario + "\n");
    }
    //FT SI HAY 
    if (ft) {
        //SI HAY MAS DE 1 FT
        if (more_ft) {
            for (var i = 0; i < usuarios_colaboradores.length; i++) {
                add("• " + nombres_colaboradores[i] + ": " + "http://instagram.com/" + usuarios_colaboradores[i] + "\n");
            }
        } else {
            //SOLO HAY 1 FT
            add("• " + colaborador + ": " + "http://instagram.com/" + colaborador_usuario + "\n");
        }
    }

    add("\n► Booking\n");

    //SI HAY BEATMAKER
    if_exist("• Instrumental:\nhttp://instagram.com/", "instrumental");

    if (grabacion == mezcla) {
        add("• Grabación, mezcla y mastering:\nhttp://instagram.com/" + grabacion + "\n\n");
    } else {
        add("• Grabación:\nhttp://instagram.com/" + grabacion + "\n");
        add("\n• Mezcla y mastering:\nhttp://instagram.com/" + mezcla + "\n\n");
    }

    //SI HAY ARTE
    if_exist("• Arte:\nhttp://instagram.com/", "arte");

    //SI HAY VIDEO
    if_exist("• Vídeo:\nhttp://instagram.com/", "video");

    add("#" + titulo.toLowerCase().replaceAll(" ", "_"));

    if (!more_at) {
        add(" #" + autor.toLowerCase().replaceAll(" ", "_"));
    } else {
        for (var i = 0; i < nombres_autores.length; i++) {
            add(" #" + nombres_autores[i].toLowerCase().replaceAll(" ", "_"));
        }
    }

    //ENFOCAR EL RESULTADO
    box.focus();

    //MOSTRAR NOTIFICACION
    Swal.fire(
        "Completado",
        "Descripción generada",
        'success'
    );
}
function copiar() {
    var content = document.getElementById("rsp");

    if (content.value.length == 0) {
        Swal.fire({
            title: "Error",
            text: "Nada que copiar",
            icon: "error",
            confirmButtonText: 'Ok'
        })
    } else {
        content.select();
        document.execCommand("copy");

        Swal.fire(
            "Copiado",
            "Descripción copiada en el portapapeles",
            'success'
        );
    }

}



