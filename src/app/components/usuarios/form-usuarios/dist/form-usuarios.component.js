"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.FormUsuariosComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var sweetalert2_1 = require("sweetalert2");
var FormUsuariosComponent = /** @class */ (function () {
    function FormUsuariosComponent(fb, validadoresService, usuariosService, location, route) {
        this.fb = fb;
        this.validadoresService = validadoresService;
        this.usuariosService = usuariosService;
        this.location = location;
        this.route = route;
        this.contrasena = '';
        this.roles = [];
        this.guardando = false;
        this.hoy = new common_1.DatePipe('es').transform(new Date(), 'yyyy-MM-dd');
        this.editar = false;
        this.usuarioExiste = false;
        this.checkeando = false;
    }
    FormUsuariosComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.crearForm();
        this.getRoles();
        var id = this.route.snapshot.params.id;
        if (id) {
            this.editar = true;
            this.usuariosService.getUsuario(id).subscribe(function (res) {
                _this.usuario = res;
                console.log(res);
                _this.usuario.contrasena2 = res.contrasena;
                var fechaAlta = new common_1.DatePipe('es').transform(_this.usuario.fechaAlta, 'yyyy-MM-dd');
                if (fechaAlta) {
                    _this.usuario.fechaAlta = fechaAlta;
                }
                _this.form.setValue(_this.usuario);
            });
        }
    };
    FormUsuariosComponent.prototype.checkearUsuario = function (param) {
        return __awaiter(this, void 0, void 0, function () {
            var promise, nuevoUsuario;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usuariosService.getUsuarios().toPromise()];
                    case 1:
                        promise = _a.sent();
                        promise.forEach(function (usuario) {
                            if (usuario.nombreUsuario == param) {
                                nuevoUsuario = usuario;
                            }
                        });
                        if (nuevoUsuario) {
                            this.usuarioExiste = true;
                        }
                        else {
                            this.usuarioExiste = false;
                        }
                        this.checkeando = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    FormUsuariosComponent.prototype.guardar = function () {
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
            this.usuariosService.editarUsuario(this.form.value).subscribe();
        }
        else {
            this.usuariosService.crearUsuario(this.form.value).subscribe();
        }
        sweetalert2_1["default"].fire({
            title: "Usuario " + this.form.controls['nombreUsuario'].value + " guardado con \u00E9xito!",
            icon: 'success',
            confirmButtonText: 'OK',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-outline-primary'
            }
        });
        /* this.location.back(); */
    };
    FormUsuariosComponent.prototype.volver = function () {
        this.location.back();
    };
    FormUsuariosComponent.prototype.getRoles = function () {
        var _this = this;
        this.usuariosService.getRoles().subscribe(function (res) {
            _this.roles = res;
            _this.roles.unshift({
                id: 0,
                authority: "Seleccione un rol"
            });
        });
    };
    Object.defineProperty(FormUsuariosComponent.prototype, "nombreUsuarioNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('nombreUsuario')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('nombreUsuario')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormUsuariosComponent.prototype, "contrasenaNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('contrasena')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('contrasena')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormUsuariosComponent.prototype, "contrasenaNoCoincide", {
        get: function () {
            var _a, _b;
            var contrasena1 = (_a = this.form.get('contrasena')) === null || _a === void 0 ? void 0 : _a.value;
            var contrasena2 = (_b = this.form.get('contrasena2')) === null || _b === void 0 ? void 0 : _b.value;
            return (contrasena1 === contrasena2) ? false : true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormUsuariosComponent.prototype, "rolNoValido", {
        get: function () {
            var _a, _b, _c, _d;
            return ((_a = this.form.get('rol.id')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('rol.id')) === null || _b === void 0 ? void 0 : _b.touched) && ((_d = (_c = this.form.get('rol.id')) === null || _c === void 0 ? void 0 : _c.errors) === null || _d === void 0 ? void 0 : _d.distintoCero);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormUsuariosComponent.prototype, "fechaAltaNoValido", {
        get: function () {
            var _a, _b;
            return ((_a = this.form.get('fechaAlta')) === null || _a === void 0 ? void 0 : _a.invalid) && ((_b = this.form.get('fechaAlta')) === null || _b === void 0 ? void 0 : _b.touched);
        },
        enumerable: false,
        configurable: true
    });
    FormUsuariosComponent.prototype.crearForm = function () {
        this.form = this.fb.group({
            id: [''],
            nombreUsuario: ['', forms_1.Validators.required],
            contrasena: ['', forms_1.Validators.required],
            contrasena2: ['', forms_1.Validators.required],
            fechaAlta: [this.hoy, forms_1.Validators.required],
            fechaBaja: [''],
            rol: this.fb.group({
                id: [0, this.validadoresService.distintoCero(/^[0]+/)],
                authority: ['']
            })
        }, {
            Validators: this.validadoresService.passwordsIguales('contrasena', 'contrasena2')
        });
    };
    FormUsuariosComponent = __decorate([
        core_1.Component({
            selector: 'app-form-usuarios',
            templateUrl: './form-usuarios.component.html',
            styleUrls: ['./form-usuarios.component.scss']
        })
    ], FormUsuariosComponent);
    return FormUsuariosComponent;
}());
exports.FormUsuariosComponent = FormUsuariosComponent;
