!function(e) {
    e && e.__esModule;
}(require("../../../libs/regenerator-runtime/runtime-module.js"));

Component({
    properties: {
        tagList: {
            type: Array,
            value: []
        },
        tagWidth: {
            type: String,
            value: "208rpx"
        },
        defaultSelect: {
            type: Object,
            value: {},
            observer: function(e, t) {
                this.setData({
                    selectedType: Object.assign({}, e)
                });
            }
        }
    },
    data: {
        selectedType: {}
    },
    methods: {
        chooseItem: function(e) {
            var t = e.target.dataset.value;
            t && !t.disabled && (this.setData({
                selectedType: e.target.dataset.value
            }), this.triggerEvent("selected", this.data.selectedType));
        }
    }
});