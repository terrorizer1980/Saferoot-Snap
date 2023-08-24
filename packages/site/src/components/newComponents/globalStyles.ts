export interface objectStyleProps {
  [key: string]: string | number;
}

export const Color: objectStyleProps = {
  limeGreen: "#E9FFF0",
  neonGreen: "#27FB6B",
  oceanGreen: "#02B23B",
  orchidPurple: "#963484",
  lightPurple: "#F4EBF3",
  darkNavyBlue: "#05445E",
  black: "#000000",
  backgroundGrey: "#F2F2F2",
  white: "#FFFFFF",
  secondaryTextColor: "#191919",
  headingColor: "#5E5E5E",
  borderColor: "#CCCCCC",
  error: "#FF0000"
};

export const Spacing: objectStyleProps = {
  GenericSpacerMargin10:  "10px 0 10px 0",
  GenericSpacerMargin20:  "20px 0 20px 0",
  GenericSpacerMargin40:  "40px 0 40px 0",
  GenericHorizontalSpacerMargin10:  "0 10px 0 0",
  GenericHorizontalSpacerMargin20:  "0 20px 0 0",
  GenericHorizontalSpacerMargin40:  "0 40px 0 0",
  GenericDialoguePadding: "30px 40px 30px 40px",
  avatarIDTextPadding: "0 0 0 10px",
  userIDPadding: "5px 5px 5px 5px",
  buttonPadding: "3px 10px 3px 10px",
  buttonTextPadding: "0 0 0 10px",
  selectionButtonTextPadding: "0 10px 0 10px",
  buttonImageMargin: "5px 0 0 0",
  tagContainerPadding: "2px 10px 2px 10px",
  tagContainerMargin: "2px 2px 2px 2px",
  WalletStatusPadding: "5px 5px 5px 5px",
  tableHeaderBottomPadding: "0 0 20px 0",
  mobileViewRootMargin: "30px 0 30px 0",
  mobileViewRootPadding: "30px 40px 30px 40px",
  mobileViewLineMargin: "10px 0 10px 0",
  mobileViewIconPadding: "10px 10px 0 0",
  mobileViewCardPadding: "10px 0 20px 0",
  dashboardMargin: "30px 50px 30px 50px",
  dashboardTablePadding: "30px 30px 30px 30px",
  dashboardTableHeader: "0 0 20px 0",
  dashboardMobileMargin: "20px 20px 20px 20px",
  dashboardCard1Margin: "0 20px 0 0",
  dashboardCard2Margin: "0 20px 0 20px",
  dashboardCard3Margin: "0 0 0 20px",
  dashboardCardMobileMargin: "8px 0 8px 0",
  modalPadding: "30px 50px 30px 50px",
  modalMobilePadding: "20px 30px 20px 30px",
  modalHeading: "50px 0 50px 0",
  modalButtonMargin: "0 20px 50px 20px ",
  safeguardCardPadding:  "20px 30px 20px 30px",
  safeguardCardMargin:  "20px 20px 20px 20px",
  safeguardCardOptionsMargin:  "20px 0 0 0",
  safeguardCardSpacerMargin:  "10px 0 10px 0",
  roundedInputPadding:  "0 0 0 20px",
  modalSafeguardAssetInfoPadding:  "20px 30px 20px 30px",
  safeguardSetupTablePadding: "30px 40px 30px 40px",
  tileViewHeaderPadding: "30px 40px 0 40px",
  tileViewHeaderMobilePadding: "30px 20px 0 20px",
  tileViewTilesContainerPadding: "10px 40px 30px 40px",
  tileViewTilesMobileContainerPadding: "10px 20px 30px 20px",
  tileViewTilePadding: "10px 5px 10px 5px",
  tileViewTileMargin: "20px 20px 20px 0",
  stepNumberMargin: "5px 20px 20px 0",
  reviewTableMargin: "5px 0 20px 40px",
  mobileViewReviewPadding: "10px 0 5px 0",
};

export const Dimensions: objectStyleProps = {
  WalletStatusDot: "8px",
  buttonHeight: '50px',
  smallButtonHeight: '35px',
  selectionButtonHeight: '40px',
  dashboardButtonWidth: '250px',
  roundedInputHeight: '50px',
  roundedInputWidth: '90%',
  safeguardCardWidth: '280px',
  assetTileWidth: '200px',
  InputPasteButtonWidth: '130px',
  progressBarHeight: '10px',
  reviewInfoHeading: '150px',
};

export const TextStyle: {
  [key: string]: objectStyleProps | { [key: string]: objectStyleProps };
} = {
  //black styles
  blackTinyLabel: {
    fontSize: "11px",
    lineHeight: "16.5px",
    color: Color.black,
  },
  blackSmallLabel: {
    fontSize: "14px",
    lineHeight: "21px",
    color: Color.black,
  },
  blackExtraSmallLabel: {
    fontSize: "12px",
    lineHeight: "18px",
    color: Color.black,
  },
  blackMediumLabel: {
    fontSize: "16px",
    lineHeight: "24px",
    color: Color.black,
  },
  blackLargeLabel: {
    fontSize: "18px",
    lineHeight: "27px",
    color: Color.black,
  },
  blackExtraLargeLabel: {
    fontSize: "28px",
    lineHeight: "36px",
    color: Color.black,
  },

  //white styles
  whiteTinyLabel: {
    fontSize: "11px",
    lineHeight: "16.5px",
    color: Color.white,
  },
  whiteSmallLabel: {
    fontSize: "14px",
    lineHeight: "21px",
    color: Color.white,
  },
  whiteExtraSmallLabel: {
    fontSize: "12px",
    lineHeight: "18px",
    color: Color.white,
  },
  whiteMediumLabel: {
    fontSize: "16px",
    lineHeight: "24px",
    color: Color.white,
  },
  whiteLargeLabel: {
    fontSize: "18px",
    lineHeight: "27px",
    color: Color.white,
  },
  whiteExtraLargeLabel: {
    fontSize: "28px",
    lineHeight: "36px",
    color: Color.white,
  },

  //secondaryTextColor styles
  secondaryTextTinyLabel: {
    fontSize: "11px",
    lineHeight: "16.5px",
    color: Color.secondaryTextColor,
  },
  secondaryTextSmallLabel: {
    fontSize: "14px",
    lineHeight: "21px",
    color: Color.secondaryTextColor,
  },
  secondaryTextExtraSmallLabel: {
    fontSize: "12px",
    lineHeight: "18px",
    color: Color.secondaryTextColor,
  },
  secondaryTextMediumLabel: {
    fontSize: "16px",
    lineHeight: "24px",
    color: Color.secondaryTextColor,
  },
  secondaryTextLargeLabel: {
    fontSize: "18px",
    lineHeight: "27px",
    color: Color.secondaryTextColor,
  },
  secondaryTextExtraLargeLabel: {
    fontSize: "28px",
    lineHeight: "36px",
    color: Color.secondaryTextColor,
  },

  //headingColor styles
  headingColorTinyLabel: {
    fontSize: "11px",
    lineHeight: "16.5px",
    color: Color.headingColor,
  },
  headingColorSmallLabel: {
    fontSize: "14px",
    lineHeight: "21px",
    color: Color.headingColor,
  },
  headingColorExtraSmallLabel: {
    fontSize: "12px",
    lineHeight: "18px",
    color: Color.headingColor,
  },
  headingColorMediumLabel: {
    fontSize: "16px",
    lineHeight: "24px",
    color: Color.headingColor,
  },
  headingColorLargeLabel: {
    fontSize: "18px",
    lineHeight: "27px",
    color: Color.headingColor,
  },
  headingColorExtraLargeLabel: {
    fontSize: "28px",
    lineHeight: "36px",
    color: Color.headingColor,
  },

  //orchidPurple styles
  orchidPurpleTinyLabel: {
    fontSize: "11px",
    lineHeight: "16.5px",
    color: Color.orchidPurple,
  },
  orchidPurpleSmallLabel: {
    fontSize: "14px",
    lineHeight: "21px",
    color: Color.orchidPurple,
  },
  orchidPurpleExtraSmallLabel: {
    fontSize: "12px",
    lineHeight: "18px",
    color: Color.orchidPurple,
  },
  orchidPurpleMediumLabel: {
    fontSize: "16px",
    lineHeight: "24px",
    color: Color.orchidPurple,
  },
  orchidPurpleLargeLabel: {
    fontSize: "18px",
    lineHeight: "27px",
    color: Color.orchidPurple,
  },
  orchidPurpleExtraLargeLabel: {
    fontSize: "28px",
    lineHeight: "36px",
    color: Color.orchidPurple,
  },

  //darkNavyBlue styles
  darkNavyBlueTinyLabel: {
    fontSize: "11px",
    lineHeight: "16.5px",
    color: Color.darkNavyBlue,
  },
  darkNavyBlueSmallLabel: {
    fontSize: "14px",
    lineHeight: "21px",
    color: Color.darkNavyBlue,
  },
  darkNavyBlueExtraSmallLabel: {
    fontSize: "12px",
    lineHeight: "18px",
    color: Color.darkNavyBlue,
  },
  darkNavyBlueMediumLabel: {
    fontSize: "16px",
    lineHeight: "24px",
    color: Color.darkNavyBlue,
  },
  darkNavyBlueLargeLabel: {
    fontSize: "18px",
    lineHeight: "27px",
    color: Color.darkNavyBlue,
  },
  darkNavyBlueExtraLargeLabel: {
    fontSize: "28px",
    lineHeight: "36px",
    color: Color.darkNavyBlue,
  },

  //oceanGren Styles
  oceanGreenSmallLabel: {
    fontSize: "14px",
    lineHeight: "21px",
    color: Color.oceanGreen,
  },

  //normal Styles
  //black styles
  tinyLabel: {
    fontSize: "11px",
    lineHeight: "16.5px",
    color: Color.black,
  },
  smallLabel: {
    fontSize: "14px",
    lineHeight: "21px",
    color: Color.black,
  },
  extraSmallLabel: {
    fontSize: "12px",
    lineHeight: "18px",
    color: Color.black,
  },
  mediumLabel: {
    fontSize: "16px",
    lineHeight: "24px",
    color: Color.black,
  },
  largeLabel: {
    fontSize: "18px",
    lineHeight: "27px",
    color: Color.black,
  },
  extraLargeLabel: {
    fontSize: "28px",
    lineHeight: "36px",
    color: Color.black,
  },

  //general Styles
  boldText: {
    styleProps: {
      fontWeight: "bold",
    },
  },
  opacity: {
    styleProps: {
      opacity: 0.7,
    },
  },
  errorText: {
    styleProps: {
      fontWeight: "bold",
      color: Color.error,
    }
  }
};
