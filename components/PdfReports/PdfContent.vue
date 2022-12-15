<template>
  <section class="pdf-content">
    <section class="report-info">
      <section class="image-container">
        <img
          class="user-image"
          src="https://i.imgur.com/wKblc.jpg"
          alt="User Image"
          ref="userImage"
        />
      </section>
      <section class="user-details">
        <h3 class="user-name">Техническое задание по инженерным системам</h3>
        <br>

        <span class="detail-container">
          <span class="detail-label">ФИО:</span>
          {{ $store.state.AuthModule.userData.user_fio }}
        </span>

        <span class="detail-container">
          <span class="detail-label">Email:</span>
          {{ $store.state.AuthModule.userData.email }}
        </span>

        <span class="detail-container">
          <span class="detail-label">Телефон:</span>
          {{ $store.state.AuthModule.userData.telephone }}
        </span>
        <span class="detail-container">
          <span class="detail-label">Адресс объекта:</span>
          {{ $store.state.currentObject.address }}
        </span>
      </section>
    </section>

    <div class="wrapper_requirements">
      <h4 class="requirements-name">Требования<hr></h4>

      <section class="requirements" v-for="(objTag, nameTag) in $store.state.PdfDataModule.report_data">
        <h4>{{ nameTag }}</h4>
        <TableByTag :obj_by_tag="objTag"></TableByTag>
      </section>
    </div>

  </section>
</template>

<script>
import TableByTag from './TableByTag'

export default {
  name: 'PdfContent',
  components: {
    TableByTag,
  },
  data() {
    return {
      chartOptions: {
        dataLabels: {
          enabled: false,
          style: {
            colors: ["#fff"],
          },
        },
        stroke: {
          curve: "smooth",
        },
        chart: {
          toolbar: {
            show: false,
            tools: {
              download: false,
            },
          },
          animations: {
            enabled: false,
            animateGradually: {
              enabled: false,
            },
            dynamicAnimation: {
              enabled: false,
            },
          },
        },
        tooltip: {
          enabled: true,
          // theme: true,
          x: {
            show: true,
            format: "MMM dd, yyyy HH:mm",
          },
        },
        legend: {
          show: true,
          labels: {
            useSeriesColors: false,
          },
          onItemClick: {
            toggleDataSeries: false,
          },
          onItemHover: {
            highlightDataSeries: true,
          },
        },
        xaxis: {
          labels: {
            style: {
              // colors: '#fff',
            },
          },
          type: "datetime",
        },
        yaxis: {
          labels: {
            style: {
              // color: '#fff',
            },
            formatter: (value) => {
              return value;
            },
          },
          type: "text",
        },
      },
    };
  },
  mounted() {
    this.$store.dispatch('PdfDataModule/getBodyData', {ids_tags: [1,2]})

    this.$nextTick(() => {
      setTimeout(() => {
        this.$emit("domRendered");
      }, 1000);
    });
  },
};
</script>

<style lang="scss" scoped>
.pdf-content {
  width: 100%;
  background: #fff;
  padding: 56px;
  .report-info {
    display: flex;
    padding: 20px;
    padding-bottom: 0px;
    .image-container {
      width: 75px;
      height: 75px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      margin-right: 25px;
      border: 1px solid #dadada;
      .user-image {
        height: 100%;
        min-width: 100%;
        margin-left: 50%;
        transform: translateX(-50%);
      }
    }
    .user-details {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      .user-name {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 10px;
        flex-shrink: 0;
      }
      .detail-container {
        font-size: 13px;
        flex-shrink: 0;
        &:not(:last-child) {
          margin-bottom: 10px;
        }
        .detail-label {
          font-weight: 600;
          margin-right: 5px;
          font-size: 13px;
        }
      }
    }
  }
  .wrapper_requirements{
    display: grid;
    grid-row-gap: 2em;

    .requirements{
      display: flex;
      flex-direction: column;
      grid-row-gap: 10px;
    }
  }
  .chart-container {
    width: 100%;
    height: 320px;
    padding: 20px;
    pointer-events: none;
    &:not(:last-child) {
      margin-bottom: 15px;
    }
  }
}
</style>
