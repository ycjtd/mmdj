import serviceStatus from "../../../../enum/service-status";
import serviceAction from "../../../../enum/service-action";
import behavior from "../behavior";
import getDataSet from '../../../../utils/util'

Component({
  behaviors: [behavior],
  properties: {},
  data: {
    serviceStatusEnum: serviceStatus,
    serviceActionEnum: serviceAction,
  },
  methods: {
    handleUpdateStatus: function (event) {
      const action = getDataSet(event, "action");
      this.triggerEvent("update", { action });
    },

    handleEditService: function () {
      this.triggerEvent("edit");
    },
  },
});
