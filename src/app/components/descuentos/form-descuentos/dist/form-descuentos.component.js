"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FormDescuentosComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var sweetalert2_1 = require("sweetalert2");
var FormDescuentosComponent = /** @class */ (function () {
    function FormDescuentosComponent(fb, route, location, descuentosService, sociosService, conveniosService, usuariosService, validadoresService, variablesService) {
        this.fb = fb;
        this.route = route;
        this.location = location;
        this.descuentosService = descuentosService;
        this.sociosService = sociosService;
        this.conveniosService = conveniosService;
        this.usuariosService = usuariosService;
        this.validadoresService = validadoresService;
        this.variablesService = variablesService;
        this.cuotas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        this.mostrarModalComercios = false;
        this.mostrarModalSocios = false;
        this.convenios = [];
        this.socios = [];
        this.guardado = true;
        this.guardando = false;
        this.editar = false;
        this.today = new common_1.DatePipe('es').transform(new Date(), 'yyyy-MM-ddTHH:mm');
    }
    FormDescuentosComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.crearForm();
        this.getVariables();
        var id = this.route.snapshot.params.id;
        if (id) {
            this.editar = true;
            this.descuentosService.getDescuento(id).subscribe(function (res) {
                console.log(res);
                _this.descuento = res;
                if (_this.descuento.convenio) {
                    var foto = { id: 0, url: '', publicId: '' };
                    var rol = { id: 0, authority: '' };
                    var usuario = { id: 0, nombreUsuario: '', contrasena: '', fechaAlta: '', fechaBaja: '', rol: rol };
                    _this.descuento.convenio.usuario = usuario;
                    _this.descuento.convenio.foto = foto;
                }
                if (res.convenio) {
                    _this.convenio = res.convenio;
                }
                _this.socio = res.socio;
                if (!_this.descuento.socio.foto) {
                    var foto = { id: 0, url: '', publicId: '' };
                    _this.descuento.socio.foto = foto;
                }
                var fechaAlta = new common_1.DatePipe('es').transform(_this.descuento.fechaAlta, 'yyyy-MM-ddTHH:mm');
                if (fechaAlta) {
                    _this.descuento.fechaAlta = fechaAlta;
                }
                if (!_this.descuento.valorCuota) {
                    _this.descuento.valorCuota = _this.descuento.valorTotal;
                }
                _this.form.setValue(_this.descuento);
            });
        }
    };
    FormDescuentosComponent.prototype.listarConvenios = function () {
        var _this = this;
        this.mostrarModalComercios = true;
        this.conveniosService.getConvenios().subscribe(function (res) {
            res.forEach(function (convenio) {
                if (convenio.id == 1) {
                    res.splice(0, 1);
                }
            });
            _this.convenios = res;
        });
    };
    FormDescuentosComponent.prototype.seleccionarConvenio = function (convenio) {
        var _this = this;
        this.convenios.find(function (element) {
            element = convenio;
            _this.convenio = convenio;
            _this.form.controls['convenio'].patchValue({
                id: element.id,
                nombre: element.nombre,
                direccion: element.direccion,
                cuit: element.cuit,
                contacto: element.contacto
            });
        });
    };
    FormDescuentosComponent.prototype.listarSocios = function () {
        var _this = this;
        this.mostrarModalSocios = true;
        this.sociosService.getSocios().subscribe(function (res) { return _this.socios = res; });
    };
    FormDescuentosComponent.prototype.seleccionarSocio = function (socio) {
        var _this = this;
        this.socios.find(function (element) {
            element = socio;
            _this.socio = socio;
            _this.form.controls['socio'].patchValue({
                id: element.id,
                nombre: element.nombre,
                apellido: element.apellido,
                numDoc: element.numDoc,
                legajo: element.legajo
            });
        });
    };
    FormDescuentosComponent.prototype.buscar = function (param) {
        var _this = this;
        if (param.length > 0) {
            this.sociosService.buscarSocios(param).subscribe(function (res) { return _this.socios = res; });
        }
        else {
            this.listarSocios();
        }
    };
    FormDescuentosComponent.prototype.getVariables = function () {
        var _this = this;
        this.variablesService.getVariables().subscribe(function (res) {
            _this.comision = (res[1].valor / 100) + 1;
            console.log(_this.comision);
        });
    };
    FormDescuentosComponent.prototype.guardar = function () {
        var _this = this;
        console.log(this.form.value);
        if (this.form.invalid) {
            return Object.values(this.form.controls).forEach(function (control) {
                if (control instanceof forms_1.FormGroup) {
                    Object.values(control.controls).forEach(function (control) { return control.markAllAsTouched; });
                }
                control.markAllAsTouched();
                console.log(_this.form);
            });
        }
        this.form.controls['valorCuota'].setValue((this.form.controls['valorTotal'].value / this.form.controls['numCuotas'].value) * this.comision);
        this.form.controls['valorTotal'].setValue(this.form.controls['valorTotal'].value * this.comision);
        this.guardando = true;
        if (this.editar) {
            this.descuentosService.editarDescuento(this.form.value).subscribe();
        }
        else {
            this.descuentosService.crearDescuento(this.form.value).subscribe();
        }
        this.guardado = true;
        sweetalert2_1["default"].fire({
            title: "Descuento de $" + this.form.controls['valorTotal'].value + " guardado con \u00E9xito!",
            icon: 'success',
            confirmButtonText: 'OK',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-outline-primary'
            }
        });
        /* this.location.back(); */
    };
    FormDescuentosComponent.prototype.volver = function () {
        this.location.back();
    };
    Object.defineProperty(FormDescuentosComponent.prototype, "descNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('descripcion')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('descripcion')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormDescuentosComponent.prototype, "cuotasNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('numCuotas')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('numCuotas')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormDescuentosComponent.prototype, "valorTotalNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('valorTotal')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('valorTotal')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormDescuentosComponent.prototype, "fechaAltaNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('fechaAlta')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('fechaAlta')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormDescuentosComponent.prototype, "socioNoValido", {
        get: function () {
            var _a, _b, _c, _d;
            return ((_a = this.form.get('socio.id')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('socio.id')) === null || _b === void 0 ? void 0 : _b.touched) && ((_d = (_c = this.form.get('socio.id')) === null || _c === void 0 ? void 0 : _c.errors) === null || _d === void 0 ? void 0 : _d.distintoCero);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormDescuentosComponent.prototype, "convenioNoValido", {
        get: function () {
            var _a, _b, _c, _d;
            return ((_a = this.form.get('convenio.id')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('convenio.id')) === null || _b === void 0 ? void 0 : _b.touched) && ((_d = (_c = this.form.get('convenio.id')) === null || _c === void 0 ? void 0 : _c.errors) === null || _d === void 0 ? void 0 : _d.distintoCero);
        },
        enumerable: false,
        configurable: true
    });
    FormDescuentosComponent.prototype.crearForm = function () {
        this.form = this.fb.group({
            id: [''],
            descripcion: ['', [forms_1.Validators.required]],
            numCuotas: ['', [forms_1.Validators.required]],
            ultimaCuota: [''],
            valorCuota: [],
            valorTotal: ['', [forms_1.Validators.required]],
            fechaAlta: [this.today, [forms_1.Validators.required]],
            cuotas: [],
            items: [],
            socio: this.fb.group({
                id: [0, this.validadoresService.distintoCero(/^[0]+/)],
                numDoc: [''],
                nombre: [''],
                apellido: [''],
                legajo: [''],
                correo: [''],
                fechaAlta: [],
                fechaBaja: [],
                direccion: [],
                baja: [],
                extranjero: [],
                fechaIngresoLaboral: [],
                fechaNacimiento: [],
                motivoBaja: [],
                numCuenta: [],
                telefono: [],
                cuil: [],
                foto: this.fb.group({
                    id: [],
                    publicId: [],
                    url: []
                }),
                cuotaSocial: this.fb.group({
                    id: [],
                    nombre: [],
                    valor: []
                }),
                usuario: this.fb.group({
                    id: [],
                    nombreUsuario: [],
                    contraseña: [],
                    fechaAlta: [],
                    fechaBaja: [],
                    rol: this.fb.group({
                        id: [],
                        authority: []
                    })
                }),
                localidad: this.fb.group({
                    id: [],
                    nombre: [],
                    cp: []
                }),
                tipoDocumento: this.fb.group({
                    id: [],
                    nombre: []
                }),
                tipo: this.fb.group({
                    id: [],
                    nombre: ['']
                }),
                estadoCivil: this.fb.group({
                    id: [],
                    nombre: []
                })
            }),
            convenio: this.fb.group({
                id: [0, this.validadoresService.distintoCero(/^[0]+/)],
                nombre: [''],
                direccion: [''],
                cuit: [''],
                contacto: [''],
                correo: [],
                fechaAlta: [],
                fechaBaja: [],
                baja: [],
                telefono: [],
                usuario: this.fb.group({
                    id: [],
                    nombreUsuario: [],
                    contraseña: [],
                    fechaAlta: [],
                    fechaBaja: [],
                    rol: this.fb.group({
                        id: [],
                        authority: []
                    })
                }),
                foto: this.fb.group({
                    id: [],
                    publicId: [],
                    url: []
                }),
                localidad: this.fb.group({
                    id: [],
                    nombre: [],
                    cp: []
                }),
                categoria: this.fb.group({
                    id: [],
                    nombre: []
                })
            })
        });
    };
    FormDescuentosComponent = __decorate([
        core_1.Component({
            selector: 'app-form-descuentos',
            templateUrl: './form-descuentos.component.html',
            styleUrls: ['./form-descuentos.component.scss']
        })
    ], FormDescuentosComponent);
    return FormDescuentosComponent;
}());
exports.FormDescuentosComponent = FormDescuentosComponent;
