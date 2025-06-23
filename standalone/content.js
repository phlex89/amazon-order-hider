"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = require("@/utils/storage");
var amazon_selectors_1 = require("@/utils/amazon-selectors");
var types_1 = require("@/types");
var AmazonOrderCleaner = (function () {
    function AmazonOrderCleaner() {
        this.observer = null;
        this.isEnabled = true;
        this.showHidden = false;
        this.hiddenOrderIds = new Set();
        this.processedElements = new WeakSet();
        this.init();
    }
    AmazonOrderCleaner.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Amazon Order Cleaner: Initializing...');
                        return [4, this.loadState()];
                    case 1:
                        _a.sent();
                        this.setupMutationObserver();
                        this.processExistingOrders();
                        this.setupStorageListener();
                        console.log('Amazon Order Cleaner: Initialized successfully');
                        return [2];
                }
            });
        });
    };
    AmazonOrderCleaner.prototype.loadState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, storage_1.storage.getAll()];
                    case 1:
                        data = _a.sent();
                        this.isEnabled = data.isEnabled;
                        this.showHidden = data.showHidden;
                        this.hiddenOrderIds = new Set(data.hiddenOrders.map(function (order) { return order.id; }));
                        return [3, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error loading state:', error_1);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    AmazonOrderCleaner.prototype.setupMutationObserver = function () {
        var _this = this;
        var container = amazon_selectors_1.AmazonSelectors.findOrderContainer();
        if (!container) {
            console.warn('Order container not found, retrying in 2 seconds...');
            setTimeout(function () { return _this.setupMutationObserver(); }, 2000);
            return;
        }
        this.observer = new MutationObserver(function (mutations) {
            var shouldProcess = false;
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldProcess = true;
                }
            });
            if (shouldProcess) {
                setTimeout(function () { return _this.processNewOrders(); }, 100);
            }
        });
        this.observer.observe(container, {
            childList: true,
            subtree: true
        });
    };
    AmazonOrderCleaner.prototype.processExistingOrders = function () {
        var _this = this;
        var orders = amazon_selectors_1.AmazonSelectors.findOrderElements();
        orders.forEach(function (order) { return _this.processOrder(order); });
    };
    AmazonOrderCleaner.prototype.processNewOrders = function () {
        var _this = this;
        var orders = amazon_selectors_1.AmazonSelectors.findOrderElements();
        orders.forEach(function (order) {
            if (!_this.processedElements.has(order)) {
                _this.processOrder(order);
                _this.processedElements.add(order);
            }
        });
    };
    AmazonOrderCleaner.prototype.processOrder = function (orderElement) {
        if (!this.isEnabled)
            return;
        var orderData = amazon_selectors_1.AmazonSelectors.extractOrderData(orderElement);
        if (!orderData)
            return;
        this.addHideButton(orderElement, orderData);
        if (this.hiddenOrderIds.has(orderData.orderId)) {
            this.setOrderVisibility(orderElement, this.showHidden ? types_1.OrderStatus.TEMPORARILY_SHOWN : types_1.OrderStatus.HIDDEN);
        }
        else {
            this.setOrderVisibility(orderElement, types_1.OrderStatus.VISIBLE);
        }
    };
    AmazonOrderCleaner.prototype.addHideButton = function (orderElement, orderData) {
        var _this = this;
        if (orderElement.querySelector('.aoc-hide-button'))
            return;
        var button = document.createElement('button');
        button.className = 'aoc-hide-button';
        button.textContent = '👁️ Nascondi';
        button.title = 'Nascondi questo ordine dalla cronologia';
        button.type = 'button';
        button.style.cssText = "\n      background: #ffd814;\n      border: 1px solid #fcd200;\n      border-radius: 8px;\n      color: #0f1111;\n      cursor: pointer;\n      font-size: 13px;\n      font-weight: 400;\n      line-height: 29px;\n      padding: 0 10px 0 11px;\n      text-align: center;\n      text-decoration: none;\n      vertical-align: middle;\n      margin-left: 8px;\n      white-space: nowrap;\n      min-width: 80px;\n      transition: all 0.2s ease;\n    ";
        button.addEventListener('mouseenter', function () {
            button.style.backgroundColor = '#f7ca00';
            button.style.borderColor = '#f2c200';
        });
        button.addEventListener('mouseleave', function () {
            button.style.backgroundColor = '#ffd814';
            button.style.borderColor = '#fcd200';
        });
        button.addEventListener('click', function (e) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        e.preventDefault();
                        e.stopPropagation();
                        return [4, this.hideOrder(orderData)];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); });
        var insertionPoint = this.findButtonInsertionPoint(orderElement);
        if (insertionPoint) {
            insertionPoint.appendChild(button);
        }
    };
    AmazonOrderCleaner.prototype.findButtonInsertionPoint = function (orderElement) {
        var selectors = [
            '.order-actions',
            '.order-header',
            '.a-row.a-spacing-base',
            '.a-row:first-child'
        ];
        for (var _i = 0, selectors_1 = selectors; _i < selectors_1.length; _i++) {
            var selector = selectors_1[_i];
            var element = orderElement.querySelector(selector);
            if (element)
                return element;
        }
        var container = document.createElement('div');
        container.className = 'aoc-button-container';
        container.style.cssText = 'margin: 8px 0; text-align: right;';
        orderElement.insertBefore(container, orderElement.firstChild);
        return container;
    };
    AmazonOrderCleaner.prototype.hideOrder = function (orderData) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, storage_1.storage.hideOrder({
                                id: orderData.orderId,
                                title: orderData.title,
                                date: orderData.date,
                                price: orderData.price
                            })];
                    case 1:
                        _a.sent();
                        this.hiddenOrderIds.add(orderData.orderId);
                        this.setOrderVisibility(orderData.element, types_1.OrderStatus.HIDDEN);
                        this.showNotification("Ordine nascosto: ".concat(orderData.title));
                        return [3, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error hiding order:', error_2);
                        this.showNotification('Errore nel nascondere l\'ordine', 'error');
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    AmazonOrderCleaner.prototype.setOrderVisibility = function (orderElement, status) {
        switch (status) {
            case types_1.OrderStatus.HIDDEN:
                orderElement.style.display = 'none';
                orderElement.setAttribute('data-aoc-status', 'hidden');
                break;
            case types_1.OrderStatus.TEMPORARILY_SHOWN:
                orderElement.style.display = '';
                orderElement.style.opacity = '0.5';
                orderElement.style.filter = 'grayscale(50%)';
                orderElement.setAttribute('data-aoc-status', 'temporarily-shown');
                break;
            case types_1.OrderStatus.VISIBLE:
            default:
                orderElement.style.display = '';
                orderElement.style.opacity = '';
                orderElement.style.filter = '';
                orderElement.setAttribute('data-aoc-status', 'visible');
                break;
        }
    };
    AmazonOrderCleaner.prototype.showNotification = function (message, type) {
        if (type === void 0) { type = 'success'; }
        var notification = document.createElement('div');
        notification.className = 'aoc-notification';
        notification.textContent = message;
        notification.style.cssText = "\n      position: fixed;\n      top: 20px;\n      right: 20px;\n      background: ".concat(type === 'success' ? '#4caf50' : '#f44336', ";\n      color: white;\n      padding: 12px 20px;\n      border-radius: 4px;\n      font-size: 14px;\n      font-weight: 500;\n      z-index: 10000;\n      box-shadow: 0 2px 8px rgba(0,0,0,0.2);\n      animation: slideIn 0.3s ease-out;\n    ");
        var style = document.createElement('style');
        style.textContent = "\n      @keyframes slideIn {\n        from { transform: translateX(100%); opacity: 0; }\n        to { transform: translateX(0); opacity: 1; }\n      }\n    ";
        document.head.appendChild(style);
        document.body.appendChild(notification);
        setTimeout(function () {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(function () { return notification.remove(); }, 300);
        }, 3000);
    };
    AmazonOrderCleaner.prototype.setupStorageListener = function () {
        var _this = this;
        chrome.storage.onChanged.addListener(function (changes) {
            if (changes.isEnabled) {
                _this.isEnabled = changes.isEnabled.newValue;
                _this.processExistingOrders();
            }
            if (changes.showHidden) {
                _this.showHidden = changes.showHidden.newValue;
                _this.processExistingOrders();
            }
            if (changes.hiddenOrders) {
                var newHiddenOrders = changes.hiddenOrders.newValue || [];
                _this.hiddenOrderIds = new Set(newHiddenOrders.map(function (order) { return order.id; }));
                _this.processExistingOrders();
            }
        });
    };
    AmazonOrderCleaner.prototype.destroy = function () {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    };
    return AmazonOrderCleaner;
}());
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        new AmazonOrderCleaner();
    });
}
else {
    new AmazonOrderCleaner();
}
window.addEventListener('beforeunload', function () {
});
exports.default = window.onload = function () {
    var textElement = document.createElement("h1");
    textElement.style.color = "red";
    textElement.style.position = "absolute";
    textElement.style.zIndex = "10000";
    textElement.style.top = "0";
    textElement.style.right = "1";
    textElement.textContent = "TEST";
    document.body.appendChild(textElement);
};
