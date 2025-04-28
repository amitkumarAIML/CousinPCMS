export const theme = {
  token: {
    // Seed Tokens
    colorPrimary: '#21B6E1', // @primary-color
    borderRadius: 5, // @border-radius-base
    fontSize: 10, // @font-size-base
    colorTextLabel: '#67768C', // @label-color
    colorError: '#FF4747', // @label-required-color
    colorBgSpotlight: '#21B6E1', // @tooltip-bg
    colorIcon: '#67768C', // @icon-color
    colorTextDisabled: '#67768C', // @disabled-color
    colorBgContainerDisabled: '#EFF2F7', // @disabled-bg
    colorBorder: '#CBD5E0', // @border-color-base
    colorSplit: '#CBD5E0', // @border-color-split
    colorText: '#67768C', // @input-color
    controlHeight: 26, // @input-height-base
    colorBorderSecondary: '#CBD5E0', // @input-border-color
    colorTextPlaceholder: '#CBD5E0', // @input-placeholder-color

    // Alias Tokens
    colorBgContainer: '#ffffff', // @segmented-bg
    colorBgElevated: '#ffffff', // @segmented-hover-bg
    colorTextSecondary: 'rgba(0, 0, 0, 0.65)', // @segmented-label-color (fade(@black, 65%))

    // Progress
    colorInfo: '#21B6E1', // @progress-default-color
    colorTextDescription: '#67768c', // @progress-info-text-color
    fontSizeLG: 10, // @progress-text-font-size (1.3em relative to 10px base)
  },
  components: {
    Form: {
      marginLG: 0, // @form-item-margin-bottom
      verticalLabelMargin: 0, // @form-vertical-label-margin
      verticalLabelPadding: 0, // @form-vertical-label-padding
      itemHeight: 0, // @form-item-label-height
    },
    Tree: {
      nodeSelectedBg: '#c9fbff',
      nodeSelectedColor: '#343941',
    },
    Modal: {
      paddingContentHorizontal: 15, // @modal-body-padding
      paddingContentVertical: 15, // @modal-body-padding
    },
    Button: {
      colorPrimary: '#21B6E1', // @btn-primary-bg
      colorTextLightSolid: '#fff', // @btn-primary-color
      controlHeight: 26, // @btn-height-base
      borderRadius: 3, // @btn-border-radius-base
      colorBorder: '#CBD5E0', // @btn-default-border
    },
    Drawer: {
      padding: 16, // @drawer-body-padding
    },
    Segmented: {
      colorBgLayout: '#21B6E1', // @segmented-selected-bg
      colorBgContainer: '#ffffff', // @segmented-bg
      colorText: 'rgba(0, 0, 0, 0.65)', // @segmented-label-color
    },
    DatePicker: {
      cellHeight: 38, // @picker-panel-cell-height
      cellWidth: 40, // @picker-panel-cell-width
      textHeight: 50, // @picker-text-height
      timeColumnWidth: 96, // @picker-time-panel-column-width
      timeColumnHeight: 244, // @picker-time-panel-column-height
      timeCellHeight: 40, // @picker-time-panel-cell-height
      colorBorder: '#CBD5E0', // @picker-border-color
    },
    Table: {
      rowHoverBg: 'transparent', // @table-row-hover-bg (none)
      headerBg: '#cbd5e0',
      headerColor: '#343941',
      cellPaddingBlockSM: 0, // @table-padding-vertical-sm
    },
    Select: {
      controlHeight: 26, // @select-height-base
      colorText: '#67768C', // @select-item-selected-color
      fontSize: 10, // @select-dropdown-font-size
      colorBorder: '#CBD5E0', // @select-border-color
      fontWeightStrong: 500, // @select-item-selected-font-weight
    },
    Progress: {
      defaultColor: '#21B6E1', // @progress-default-color
      remainingBgColor: '#cbd5e0', // @progress-remaining-color
    },
  },
};

export default theme;
