"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FormConveniosComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var sweetalert2_1 = require("sweetalert2");
var FormConveniosComponent = /** @class */ (function () {
    function FormConveniosComponent(fb, route, location, conveniosService, categoriasService, usuariosService, fotosService, localidadesService, validadoresService) {
        this.fb = fb;
        this.route = route;
        this.location = location;
        this.conveniosService = conveniosService;
        this.categoriasService = categoriasService;
        this.usuariosService = usuariosService;
        this.fotosService = fotosService;
        this.localidadesService = localidadesService;
        this.validadoresService = validadoresService;
        this.contrasena = '';
        this.subiendo = false;
        this.guardado = true;
        this.guardando = false;
        this.categorias = [];
        this.localidades = [];
        this.editar = false;
        this.today = new common_1.DatePipe('es').transform(new Date(), 'yyyy-MM-dd');
    }
    FormConveniosComponent.prototype.ngOnDestroy = function () {
        if (!this.guardado) {
            this.borrarImagen(this.foto);
        }
    };
    FormConveniosComponent.prototype.onReload = function () {
        if (!this.guardado) {
            this.borrarImagen(this.foto);
        }
    };
    FormConveniosComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.crearForm();
        this.categoriasService.getCategorias().subscribe(function (res) {
            res.splice(0, 1);
            _this.categorias = res;
            _this.categorias.unshift({
                id: 0,
                nombre: 'Seleccione la categoría'
            });
        });
        this.localidadesService.getLocalidades().subscribe(function (res) {
            _this.localidades = res;
            _this.localidades.unshift({
                id: 0,
                nombre: 'Seleccione la localidad',
                cp: 0
            });
        });
        this.usuariosService.getRol(4).subscribe(function (res) { return _this.rol = res; });
        var id = this.route.snapshot.params.id;
        if (id) {
            this.editar = true;
            this.conveniosService.getConvenio(id).subscribe(function (res) {
                _this.convenio = res;
                console.log(_this.convenio);
                _this.convenio.fechaAlta = _this.formatFecha(res.fechaAlta);
                _this.convenio.fechaBaja = _this.formatFecha(res.fechaBaja);
                if (!_this.convenio.foto) {
                    var foto = { id: 0, url: '', publicId: '' };
                    _this.convenio.foto = foto;
                }
                _this.convenio.baja = res.baja.toString();
                /* this.socio.extranjero = res.extranjero; */
                if (_this.convenio.foto.id != 0) {
                    _this.foto = _this.fotoAnterior = _this.convenio.foto;
                }
                _this.form.setValue(_this.convenio);
            });
        }
        else {
            /* this.cargarDataAlFormulario(); */
        }
    };
    FormConveniosComponent.prototype.formatFecha = function (fecha) {
        var fechaFormat = new common_1.DatePipe('es').transform(fecha, 'yyyy-MM-dd', 'UTC+3');
        if (fechaFormat) {
            return fechaFormat;
        }
        else {
            return '';
        }
    };
    FormConveniosComponent.prototype.cambioValor = function (valor) {
        if (valor == 'true') {
            this.form.controls['fechaBaja'].setValue(this.today);
            this.form.controls['usuario'].patchValue({ fechaBaja: this.today });
        }
        else {
            this.form.controls['fechaBaja'].setValue('');
            this.form.controls['usuario'].patchValue({ fechaBaja: '' });
        }
    };
    // INPUT FILE FOTO
    FormConveniosComponent.prototype.inputFoto = function () {
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
    FormConveniosComponent.prototype.subirImagen = function (file) {
        var _this = this;
        this.subiendo = true;
        if (!this.guardado) {
            this.borrarImagen(this.foto);
        }
        var tipo = 'comercio';
        this.fotosService.subirImagen(file, tipo).subscribe(function (res) {
            _this.foto = res;
            console.log(_this.foto);
            _this.guardado = false;
            _this.form.controls['foto'].patchValue({ id: '', publicId: res.publicId, url: res.url });
            _this.subiendo = false;
        });
    };
    FormConveniosComponent.prototype.borrarImagen = function (img) {
        if (this.foto) {
            this.fotosService.borrarImagen(img.publicId).subscribe();
        }
    };
    FormConveniosComponent.prototype.crearUsuarioPass = function (comercio, contacto, telefono, correo) {
        this.form.controls['usuario'].patchValue({ nombreUsuario: correo });
        if (comercio != '' && contacto != '' && telefono != '') {
            this.contrasena = comercio.charAt(0).toLowerCase().concat(contacto.charAt(0).toLowerCase()).concat(telefono);
            this.form.controls['usuario'].patchValue({ contraseña: this.contrasena });
        }
    };
    FormConveniosComponent.prototype.asignarFechaAltaUsuario = function (fecha) {
        this.form.controls['usuario'].patchValue({ fechaAlta: fecha });
    };
    FormConveniosComponent.prototype.asignarFechaBajaUsuario = function (fecha) {
        this.form.controls['usuario'].patchValue({ fechaBaja: fecha });
    };
    Object.defineProperty(FormConveniosComponent.prototype, "cuitNoValido", {
        // VALIDACIONES
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('cuit')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('cuit')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormConveniosComponent.prototype, "nombreNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('nombre')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('nombre')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormConveniosComponent.prototype, "correoNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('correo')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('correo')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormConveniosComponent.prototype, "telefonoNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('telefono')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('telefono')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormConveniosComponent.prototype, "direccionNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('direccion')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('direccion')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormConveniosComponent.prototype, "localidadNoValido", {
        get: function () {
            var _a, _b, _c, _d;
            return ((_a = this.form.get('localidad.id')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('localidad.id')) === null || _b === void 0 ? void 0 : _b.touched) && ((_d = (_c = this.form.get('localidad.id')) === null || _c === void 0 ? void 0 : _c.errors) === null || _d === void 0 ? void 0 : _d.distintoCero);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormConveniosComponent.prototype, "categoriaNoValido", {
        get: function () {
            var _a, _b, _c, _d;
            return ((_a = this.form.get('categoria.id')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('categoria.id')) === null || _b === void 0 ? void 0 : _b.touched) && ((_d = (_c = this.form.get('categoria.id')) === null || _c === void 0 ? void 0 : _c.errors) === null || _d === void 0 ? void 0 : _d.distintoCero);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormConveniosComponent.prototype, "fechaAltaNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('fechaAlta')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('fechaAlta')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormConveniosComponent.prototype, "contactoNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('contacto')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('contacto')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    FormConveniosComponent.prototype.crearForm = function () {
        this.form = this.fb.group({
            id: [''],
            nombre: ['', [forms_1.Validators.required]],
            correo: ['', [forms_1.Validators.required, forms_1.Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')],],
            fechaAlta: [this.today, [forms_1.Validators.required]],
            fechaBaja: [''],
            direccion: ['', [forms_1.Validators.required]],
            baja: ['false'],
            telefono: ['', [forms_1.Validators.required]],
            cuit: ['', [forms_1.Validators.required]],
            contacto: ['', [forms_1.Validators.required]],
            usuario: this.fb.group({
                id: [],
                nombreUsuario: [''],
                contraseña: [''],
                fechaAlta: [''],
                fechaBaja: [''],
                rol: this.fb.group({
                    id: [4],
                    authority: ['']
                })
            }),
            foto: this.fb.group({
                id: [''],
                publicId: [''],
                url: ['']
            }),
            localidad: this.fb.group({
                id: [0, this.validadoresService.distintoCero(/^[0]+/)],
                nombre: [''],
                cp: []
            }),
            categoria: this.fb.group({
                id: [0, this.validadoresService.distintoCero(/^[0]+/)],
                nombre: ['']
            })
        });
    };
    FormConveniosComponent.prototype.guardar = function () {
        console.log(this.form.value);
        if (this.editar) {
            this.conveniosService.editarConvenio(this.form.value).subscribe();
        }
        else {
            this.conveniosService.crearConvenio(this.form.value).subscribe();
        }
        this.guardando = true;
        if (this.foto && this.fotoAnterior && this.foto.publicId != this.fotoAnterior.publicId) {
            this.borrarImagen(this.fotoAnterior);
            this.fotoAnterior = this.foto;
        }
        this.guardado = true;
        sweetalert2_1["default"].fire({
            title: "Comercio " + this.form.controls['nombre©'].value + " guardado con \u00E9xito!",
            icon: 'success',
            confirmButtonText: 'OK',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-outline-primary'
            }
        });
        this.location.back();
    };
    FormConveniosComponent.prototype.volver = function () {
        this.location.back();
    };
    __decorate([
        core_1.HostListener('window:beforeunload')
    ], FormConveniosComponent.prototype, "onReload");
    FormConveniosComponent = __decorate([
        core_1.Component({
            selector: 'app-form-convenios',
            templateUrl: './form-convenios.component.html',
            styleUrls: ['./form-convenios.component.scss']
        })
    ], FormConveniosComponent);
    return FormConveniosComponent;
}());
exports.FormConveniosComponent = FormConveniosComponent;
