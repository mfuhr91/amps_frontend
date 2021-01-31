"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FormSociosComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var rxjs_1 = require("rxjs");
var sweetalert2_1 = require("sweetalert2");
var FormSociosComponent = /** @class */ (function () {
    function FormSociosComponent(fb, sociosService, location, route, localidadesService, usuariosService, variablesService, fotosService, validadoresService, descuentosService) {
        this.fb = fb;
        this.sociosService = sociosService;
        this.location = location;
        this.route = route;
        this.localidadesService = localidadesService;
        this.usuariosService = usuariosService;
        this.variablesService = variablesService;
        this.fotosService = fotosService;
        this.validadoresService = validadoresService;
        this.descuentosService = descuentosService;
        this.contrasena = '';
        this.localidades = [];
        this.roles = [];
        this.subiendo = false;
        this.guardado = true;
        this.guardando = false;
        this.tiposDocumentos = [];
        this.tipos = [];
        this.estadosCiviles = [];
        this.hoy = new common_1.DatePipe('es').transform(new Date(), 'yyyy-MM-dd');
        this.trigger = new rxjs_1.Subject();
        this.editar = false;
        this.activarCamara = false;
        this.crearForm();
    }
    FormSociosComponent.prototype.ngOnDestroy = function () {
        if (!this.guardado) {
            this.borrarImagen(this.foto);
        }
    };
    FormSociosComponent.prototype.onReload = function () {
        if (!this.guardado) {
            this.borrarImagen(this.foto);
        }
    };
    FormSociosComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.form.controls['usuario'].patchValue({ fechaAlta: this.hoy });
        this.sociosService.getTiposDocumentos().subscribe(function (res) {
            _this.tiposDocumentos = res;
            _this.tiposDocumentos.unshift({
                id: 0,
                nombre: 'Seleccione un tipo'
            });
        });
        this.variablesService.getVariable(1).subscribe(function (res) {
            _this.form.controls['cuotaSocial'].patchValue({ id: res.id, valor: res.valor });
        });
        this.usuariosService.getRol(3).subscribe(function (res) { return _this.rol = res; });
        this.localidadesService.getLocalidades().subscribe(function (res) {
            _this.localidades = res;
            _this.localidades.unshift({
                id: 0,
                nombre: 'Seleccione la localidad',
                cp: 0
            });
        });
        this.sociosService.getTipos().subscribe(function (res) {
            _this.tipos = res;
            _this.tipos.unshift({
                id: 0,
                nombre: 'Seleccione la clase'
            });
        });
        this.sociosService.getEstadosCiviles().subscribe(function (res) {
            _this.estadosCiviles = res;
            _this.estadosCiviles.unshift({
                id: 0,
                nombre: 'Seleccione el estado civil'
            });
        });
        var id = this.route.snapshot.params.id;
        if (id) {
            this.editar = true;
            this.sociosService.getSocio(id).subscribe(function (res) {
                _this.socio = res;
                _this.socio.fechaAlta = _this.formatFecha(res.fechaAlta);
                _this.socio.fechaBaja = _this.formatFecha(res.fechaBaja);
                _this.socio.fechaNacimiento = _this.formatFecha(res.fechaNacimiento);
                _this.socio.fechaIngresoLaboral = _this.formatFecha(res.fechaIngresoLaboral);
                if (!_this.socio.foto) {
                    var foto = { id: 0, url: '', publicId: '' };
                    _this.socio.foto = foto;
                }
                _this.socio.baja = res.baja.toString();
                /* this.socio.extranjero = res.extranjero; */
                if (_this.socio.foto.id != 0) {
                    _this.foto = _this.fotoAnterior = _this.socio.foto;
                }
                _this.form.setValue(_this.socio);
            });
        }
        else {
            /* this.cargarDataAlFormulario(); */
        }
    };
    FormSociosComponent.prototype.cambioValor = function (valor) {
        if (valor == 'true') {
            this.form.controls['fechaBaja'].setValue(this.hoy);
            this.form.controls['usuario'].patchValue({ fechaBaja: this.hoy });
        }
        else {
            this.form.controls['fechaBaja'].setValue('');
            this.form.controls['usuario'].patchValue({ fechaBaja: '' });
        }
    };
    FormSociosComponent.prototype.formatFecha = function (fecha) {
        var fechaFormat = new common_1.DatePipe('es').transform(fecha, 'yyyy-MM-dd', 'UTC+3');
        if (fechaFormat) {
            return fechaFormat;
        }
        else {
            return '';
        }
    };
    // TODO: ARREGLAR IMAGEN
    // MANEJO DE WEBCAM
    FormSociosComponent.prototype.triggerSnapshot = function () {
        this.trigger.next();
        this.activarCamara = false;
    };
    FormSociosComponent.prototype.handleImage = function (webcamImage) {
        var file = this.webcamImageToFile(webcamImage.imageAsDataUrl, 'image/jpeg');
        this.subirImagen(file);
    };
    Object.defineProperty(FormSociosComponent.prototype, "triggerObservable", {
        get: function () {
            return this.trigger.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    FormSociosComponent.prototype.webcamImageToFile = function (webcamUrl, type) {
        // convert base64 to raw binary data held in a string
        var byteString = atob(webcamUrl.split(',')[1]);
        // write the bytes of the string to an ArrayBuffer
        var fecha = new Date();
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        // write the ArrayBuffer to a blob, and you're done
        var bb = new Blob([ab], { type: type });
        return new File([ab], 'webcam-foto', {
            type: type,
            lastModified: fecha.getTime()
        });
    };
    // FIN MANEJO DE WEBCAM
    // INPUT FILE FOTO
    FormSociosComponent.prototype.inputFoto = function () {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: 'Seleccione una foto',
            input: 'file',
            inputAttributes: {
                accept: 'image/*',
                'aria-label': 'Suba la foto de perfil'
            },
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Subir',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-outline-primary me-1',
                cancelButton: 'btn btn-outline-danger ms-1'
            }
        }).then(function (res) {
            if (res.value) {
                _this.subirImagen(res.value);
            }
        });
    };
    // FIN INPUT FILE FOTO
    FormSociosComponent.prototype.subirImagen = function (file) {
        var _this = this;
        this.subiendo = true;
        var tipo = "socio";
        if (!this.guardado) {
            this.borrarImagen(this.foto);
        }
        this.fotosService.subirImagen(file, tipo).subscribe(function (res) {
            _this.foto = res;
            _this.guardado = false;
            _this.form.controls['foto'].patchValue({ id: '', publicId: res.publicId, url: res.url });
            _this.subiendo = false;
        });
    };
    FormSociosComponent.prototype.borrarImagen = function (img) {
        if (this.foto) {
            this.fotosService.borrarImagen(img.publicId).subscribe();
        }
    };
    FormSociosComponent.prototype.crearUsuarioPass = function (nombre, apellido, documento, correo) {
        this.form.controls['usuario'].patchValue({ nombreUsuario: correo });
        if (nombre != '' && apellido != '' && documento != '') {
            this.contrasena = nombre.charAt(0).toLowerCase().concat(apellido.charAt(0).toLowerCase()).concat(documento);
            this.form.controls['usuario'].patchValue({ contraseña: this.contrasena });
        }
    };
    FormSociosComponent.prototype.asignarFechaAltaUsuario = function (fecha) {
        this.form.controls['usuario'].patchValue({ fechaAlta: fecha });
    };
    FormSociosComponent.prototype.asignarFechaBajaUsuario = function (fecha) {
        this.form.controls['usuario'].patchValue({ fechaBaja: fecha });
    };
    FormSociosComponent.prototype.guardar = function () {
        if (this.form.invalid) {
            return Object.values(this.form.controls).forEach(function (control) {
                if (control instanceof forms_1.FormGroup) {
                    Object.values(control.controls).forEach(function (control) { return control.markAllAsTouched; });
                }
                control.markAllAsTouched();
            });
        }
        this.guardando = true;
        if (this.editar) {
            this.sociosService.editarSocio(this.form.value).subscribe();
        }
        else {
            this.sociosService.crearSocio(this.form.value).subscribe();
        }
        if (this.foto && this.fotoAnterior && this.foto.publicId != this.fotoAnterior.publicId) {
            this.borrarImagen(this.fotoAnterior);
            this.fotoAnterior = this.foto;
        }
        this.guardado = true;
        sweetalert2_1["default"].fire({
            title: "Socio " + this.form.controls['apellido'].value + ", " + this.form.controls['nombre'].value + " guardado con \u00E9xito!",
            icon: 'success',
            confirmButtonText: 'OK',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-outline-primary'
            }
        });
        this.location.back();
    };
    FormSociosComponent.prototype.volver = function () {
        this.location.back();
    };
    Object.defineProperty(FormSociosComponent.prototype, "nombreNoValido", {
        // VALIDACIONES
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('nombre')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('nombre')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "apellidoNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('apellido')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('apellido')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "tipoDocumentoNoValido", {
        get: function () {
            var _a, _b, _c, _d;
            return ((_a = this.form.get('tipoDocumento.id')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('tipoDocumento.id')) === null || _b === void 0 ? void 0 : _b.touched) && ((_d = (_c = this.form.get('tipoDocumento.id')) === null || _c === void 0 ? void 0 : _c.errors) === null || _d === void 0 ? void 0 : _d.distintoCero);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "docNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('numDoc')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('numDoc')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "correoNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('correo')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('correo')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "telefonoNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('telefono')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('telefono')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "cuilNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('cuil')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('cuil')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "direccionNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('direccion')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('direccion')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "fechaAltaNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('fechaAlta')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('fechaAlta')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "fechaIngresoLaboralNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('fechaIngresoLaboral')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('fechaIngresoLaboral')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "fechaNacimientoNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('fechaNacimiento')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('fechaNacimiento')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "estadoCivilNoValido", {
        get: function () {
            var _a, _b, _c, _d;
            return ((_a = this.form.get('estadoCivil.id')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('estadoCivil.id')) === null || _b === void 0 ? void 0 : _b.touched) && ((_d = (_c = this.form.get('estadoCivil.id')) === null || _c === void 0 ? void 0 : _c.errors) === null || _d === void 0 ? void 0 : _d.distintoCero);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "localidadNoValido", {
        get: function () {
            var _a, _b, _c, _d;
            return ((_a = this.form.get('localidad.id')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('localidad.id')) === null || _b === void 0 ? void 0 : _b.touched) && ((_d = (_c = this.form.get('localidad.id')) === null || _c === void 0 ? void 0 : _c.errors) === null || _d === void 0 ? void 0 : _d.distintoCero);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "legajoNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('legajo')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('legajo')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "tipoNoValido", {
        get: function () {
            var _a, _b, _c, _d;
            return ((_a = this.form.get('tipo.id')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('tipo.id')) === null || _b === void 0 ? void 0 : _b.touched) && ((_d = (_c = this.form.get('tipo.id')) === null || _c === void 0 ? void 0 : _c.errors) === null || _d === void 0 ? void 0 : _d.distintoCero);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormSociosComponent.prototype, "numCuentaNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('numCuenta')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('numCuenta')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    FormSociosComponent.prototype.crearForm = function () {
        this.form = this.fb.group({
            id: [''],
            numDoc: ['', [forms_1.Validators.required]],
            nombre: ['', [forms_1.Validators.required]],
            apellido: ['', [forms_1.Validators.required]],
            correo: ['', [forms_1.Validators.required, forms_1.Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')],],
            fechaAlta: [this.hoy, [forms_1.Validators.required]],
            fechaBaja: [''],
            direccion: ['', [forms_1.Validators.required]],
            baja: ['false'],
            extranjero: [false],
            fechaIngresoLaboral: ['', [forms_1.Validators.required]],
            fechaNacimiento: ['', [forms_1.Validators.required]],
            legajo: ['', [forms_1.Validators.required]],
            motivoBaja: [''],
            numCuenta: ['', [forms_1.Validators.required]],
            telefono: ['', [forms_1.Validators.required]],
            cuil: ['', [forms_1.Validators.required]],
            foto: this.fb.group({
                id: [''],
                publicId: [''],
                url: ['']
            }),
            cuotaSocial: this.fb.group({
                id: [''],
                nombre: [''],
                valor: ['']
            }),
            usuario: this.fb.group({
                id: [],
                nombreUsuario: [''],
                contrasena: [''],
                fechaAlta: [''],
                fechaBaja: [''],
                rol: this.fb.group({
                    id: [3],
                    authority: ['']
                })
            }),
            localidad: this.fb.group({
                id: [0, this.validadoresService.distintoCero(/^[0]+/)],
                nombre: [''],
                cp: []
            }),
            tipoDocumento: this.fb.group({
                id: [0, this.validadoresService.distintoCero(/^[0]+/)],
                nombre: ['']
            }),
            tipo: this.fb.group({
                id: [0, this.validadoresService.distintoCero(/^[0]+/)],
                nombre: ['']
            }),
            estadoCivil: this.fb.group({
                id: [0, this.validadoresService.distintoCero(/^[0]+/)],
                nombre: ['']
            })
        });
    };
    __decorate([
        core_1.HostListener('window:beforeunload')
    ], FormSociosComponent.prototype, "onReload");
    FormSociosComponent = __decorate([
        core_1.Component({
            selector: 'app-form',
            templateUrl: './form-socios.component.html',
            styleUrls: ['./form-socios.component.scss']
        })
    ], FormSociosComponent);
    return FormSociosComponent;
}());
exports.FormSociosComponent = FormSociosComponent;
