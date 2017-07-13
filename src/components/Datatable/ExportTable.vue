<template>
<table class="v-table" id="exportTable">
    <v-thead slot="header" name="header">
      <v-tr>
        <v-th v-for="column in tableColumns"
          :column="column"/>
      </v-tr>
    </v-thead>
    <v-tbody>
      <v-tr v-for="(data, index) in tableData">
        <v-td v-for="column in tableColumns"
          :data="data"
          :column="column"
          isCloseTip>
        </v-td>
      </v-tr>
    </v-tbody>
  </table>
</template>

<script>
import VThead from '../VDatatable/VThead'
import VTbody from '../VDatatable/VTbody'
import VTr from '../VDatatable/VTr'
import VTh from '../VDatatable/VTh'
import VTd from '../VDatatable/VTd'

export default {
  name: 'export-table',
  components: {
    VThead,
    VTbody,
    VTr,
    VTh,
    VTd
  },
  props: {
    tableData: Array,
    tableColumns: Array
  }
}
</script>
