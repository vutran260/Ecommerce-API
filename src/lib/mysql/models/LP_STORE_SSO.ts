import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { LP_STORE, LP_STOREId } from './LP_STORE';

export interface LP_STORE_SSOAttributes {
  storeId: string;
  storeName?: string;
  storeShortName?: string;
  storeCode?: string;
  postalCode?: string;
  prefecture?: string;
  address?: string;
  searchIndex?: string;
  phoneNumber?: string;
  faxNumber?: string;
  longitude?: number;
  latitude?: number;
  transportation?: string;
  newsFromStore?: string;
  regularHoliday?: string;
  existParking?: number;
  parkingComment?: string;
  canCreditCard?: number;
  canUseCreditCardBrands?: string;
  canElectronicMoney?: number;
  canElectronicMoneyBrands?: string;
  canBarCodePayment?: number;
  canBarCodePaymentBrands?: string;
  mondayBusinessFromTime?: string;
  mondayBusinessEndTime?: string;
  tuesdayBusinessFromTime?: string;
  tuesdayBusinessEndTime?: string;
  wednesdayBusinessFromTime?: string;
  wednesdayBusinessEndTime?: string;
  thursdayBusinessFromTime?: string;
  thursdayBusinessEndTime?: string;
  fridayBusinessFromTime?: string;
  fridayBusinessEndTime?: string;
  saturdayBusinessFromTime?: string;
  saturdayBusinessEndTime?: string;
  sundayBusinessFromTime?: string;
  sundayBusinessEndTime?: string;
  nationalHolidayBusinessFromTime?: string;
  nationalHolidayBusinessEndTime?: string;
  businessTimeDisplay?: string;
  isIncludeDisplayNationalHoliday?: number;
  businessTimeComment?: string;
  tuesdayReceptionFromTime?: string;
  tuesdayReceptionEndTime?: string;
  mondayReceptionFromTime?: string;
  mondayReceptionEndTime?: string;
  wednesdayReceptionFromTime?: string;
  wednesdayReceptionEndTime?: string;
  thursdayReceptionFromTime?: string;
  thursdayReceptionEndTime?: string;
  fridayReceptionFromTime?: string;
  fridayReceptionEndTime?: string;
  saturdayReceptionFromTime?: string;
  saturdayReceptionEndTime?: string;
  sundayReceptionFromTime?: string;
  sundayReceptionEndTime?: string;
  nationalHolidayReceptionFromTime?: string;
  nationalHolidayReceptionEndTime?: string;
  canIssueTerminalCertificate?: number;
  useTerminalCertificate?: number;
  canEditSelfInfo?: number;
  canManageStaff?: number;
  isPublic?: number;
  isBusinessSetting?: number;
  existLogoImage?: number;
  existStoreImage?: number;
  shopId?: string;
  shopPass?: string;
  siteId?: string;
  sitePass?: string;
  logoImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LP_STORE_SSOPk = 'storeId';
export type LP_STORE_SSOId = LP_STORE_SSO[LP_STORE_SSOPk];
export type LP_STORE_SSOOptionalAttributes =
  | 'storeName'
  | 'storeShortName'
  | 'storeCode'
  | 'postalCode'
  | 'prefecture'
  | 'address'
  | 'searchIndex'
  | 'phoneNumber'
  | 'faxNumber'
  | 'longitude'
  | 'latitude'
  | 'transportation'
  | 'newsFromStore'
  | 'regularHoliday'
  | 'existParking'
  | 'parkingComment'
  | 'canCreditCard'
  | 'canUseCreditCardBrands'
  | 'canElectronicMoney'
  | 'canElectronicMoneyBrands'
  | 'canBarCodePayment'
  | 'canBarCodePaymentBrands'
  | 'mondayBusinessFromTime'
  | 'mondayBusinessEndTime'
  | 'tuesdayBusinessFromTime'
  | 'tuesdayBusinessEndTime'
  | 'wednesdayBusinessFromTime'
  | 'wednesdayBusinessEndTime'
  | 'thursdayBusinessFromTime'
  | 'thursdayBusinessEndTime'
  | 'fridayBusinessFromTime'
  | 'fridayBusinessEndTime'
  | 'saturdayBusinessFromTime'
  | 'saturdayBusinessEndTime'
  | 'sundayBusinessFromTime'
  | 'sundayBusinessEndTime'
  | 'nationalHolidayBusinessFromTime'
  | 'nationalHolidayBusinessEndTime'
  | 'businessTimeDisplay'
  | 'isIncludeDisplayNationalHoliday'
  | 'businessTimeComment'
  | 'tuesdayReceptionFromTime'
  | 'tuesdayReceptionEndTime'
  | 'mondayReceptionFromTime'
  | 'mondayReceptionEndTime'
  | 'wednesdayReceptionFromTime'
  | 'wednesdayReceptionEndTime'
  | 'thursdayReceptionFromTime'
  | 'thursdayReceptionEndTime'
  | 'fridayReceptionFromTime'
  | 'fridayReceptionEndTime'
  | 'saturdayReceptionFromTime'
  | 'saturdayReceptionEndTime'
  | 'sundayReceptionFromTime'
  | 'sundayReceptionEndTime'
  | 'nationalHolidayReceptionFromTime'
  | 'nationalHolidayReceptionEndTime'
  | 'canIssueTerminalCertificate'
  | 'useTerminalCertificate'
  | 'canEditSelfInfo'
  | 'canManageStaff'
  | 'isPublic'
  | 'isBusinessSetting'
  | 'existLogoImage'
  | 'existStoreImage'
  | 'shopId'
  | 'shopPass'
  | 'siteId'
  | 'sitePass'
  | 'logoImage'
  | 'createdAt'
  | 'updatedAt';
export type LP_STORE_SSOCreationAttributes = Optional<
  LP_STORE_SSOAttributes,
  LP_STORE_SSOOptionalAttributes
>;

export class LP_STORE_SSO
  extends Model<LP_STORE_SSOAttributes, LP_STORE_SSOCreationAttributes>
  implements LP_STORE_SSOAttributes
{
  storeId!: string;
  storeName?: string;
  storeShortName?: string;
  storeCode?: string;
  postalCode?: string;
  prefecture?: string;
  address?: string;
  searchIndex?: string;
  phoneNumber?: string;
  faxNumber?: string;
  longitude?: number;
  latitude?: number;
  transportation?: string;
  newsFromStore?: string;
  regularHoliday?: string;
  existParking?: number;
  parkingComment?: string;
  canCreditCard?: number;
  canUseCreditCardBrands?: string;
  canElectronicMoney?: number;
  canElectronicMoneyBrands?: string;
  canBarCodePayment?: number;
  canBarCodePaymentBrands?: string;
  mondayBusinessFromTime?: string;
  mondayBusinessEndTime?: string;
  tuesdayBusinessFromTime?: string;
  tuesdayBusinessEndTime?: string;
  wednesdayBusinessFromTime?: string;
  wednesdayBusinessEndTime?: string;
  thursdayBusinessFromTime?: string;
  thursdayBusinessEndTime?: string;
  fridayBusinessFromTime?: string;
  fridayBusinessEndTime?: string;
  saturdayBusinessFromTime?: string;
  saturdayBusinessEndTime?: string;
  sundayBusinessFromTime?: string;
  sundayBusinessEndTime?: string;
  nationalHolidayBusinessFromTime?: string;
  nationalHolidayBusinessEndTime?: string;
  businessTimeDisplay?: string;
  isIncludeDisplayNationalHoliday?: number;
  businessTimeComment?: string;
  tuesdayReceptionFromTime?: string;
  tuesdayReceptionEndTime?: string;
  mondayReceptionFromTime?: string;
  mondayReceptionEndTime?: string;
  wednesdayReceptionFromTime?: string;
  wednesdayReceptionEndTime?: string;
  thursdayReceptionFromTime?: string;
  thursdayReceptionEndTime?: string;
  fridayReceptionFromTime?: string;
  fridayReceptionEndTime?: string;
  saturdayReceptionFromTime?: string;
  saturdayReceptionEndTime?: string;
  sundayReceptionFromTime?: string;
  sundayReceptionEndTime?: string;
  nationalHolidayReceptionFromTime?: string;
  nationalHolidayReceptionEndTime?: string;
  canIssueTerminalCertificate?: number;
  useTerminalCertificate?: number;
  canEditSelfInfo?: number;
  canManageStaff?: number;
  isPublic?: number;
  isBusinessSetting?: number;
  existLogoImage?: number;
  existStoreImage?: number;
  shopId?: string;
  shopPass?: string;
  siteId?: string;
  sitePass?: string;
  logoImage?: string;
  createdAt!: Date;
  updatedAt!: Date;

  // LP_STORE_SSO belongsTo LP_STORE via storeId
  store!: LP_STORE;
  getStore!: Sequelize.BelongsToGetAssociationMixin<LP_STORE>;
  setStore!: Sequelize.BelongsToSetAssociationMixin<LP_STORE, LP_STOREId>;
  createStore!: Sequelize.BelongsToCreateAssociationMixin<LP_STORE>;

  static initModel(sequelize: Sequelize.Sequelize): typeof LP_STORE_SSO {
    return LP_STORE_SSO.init(
      {
        storeId: {
          type: DataTypes.STRING(36),
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'LP_STORE',
            key: 'id',
          },
          field: 'store_id',
        },
        storeName: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'store_name',
        },
        storeShortName: {
          type: DataTypes.STRING(20),
          allowNull: true,
          field: 'store_short_name',
        },
        storeCode: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'store_code',
        },
        postalCode: {
          type: DataTypes.STRING(10),
          allowNull: true,
          field: 'postal_code',
        },
        prefecture: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        address: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        searchIndex: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'search_index',
        },
        phoneNumber: {
          type: DataTypes.STRING(20),
          allowNull: true,
          field: 'phone_number',
        },
        faxNumber: {
          type: DataTypes.STRING(100),
          allowNull: true,
          field: 'fax_number',
        },
        longitude: {
          type: DataTypes.DECIMAL(24, 6),
          allowNull: true,
        },
        latitude: {
          type: DataTypes.DECIMAL(24, 20),
          allowNull: true,
        },
        transportation: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        newsFromStore: {
          type: DataTypes.STRING(500),
          allowNull: true,
          field: 'news_from_store',
        },
        regularHoliday: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'regular_holiday',
        },
        existParking: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'exist_parking',
        },
        parkingComment: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'parking_comment',
        },
        canCreditCard: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'can_credit_card',
        },
        canUseCreditCardBrands: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'can_use_credit_card_brands',
        },
        canElectronicMoney: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'can_electronic_money',
        },
        canElectronicMoneyBrands: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'can_electronic_money_brands',
        },
        canBarCodePayment: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'can_bar_code_payment',
        },
        canBarCodePaymentBrands: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'can_bar_code_payment_brands',
        },
        mondayBusinessFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'monday_business_from_time',
        },
        mondayBusinessEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'monday_business_end_time',
        },
        tuesdayBusinessFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'tuesday_business_from_time',
        },
        tuesdayBusinessEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'tuesday_business_end_time',
        },
        wednesdayBusinessFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'wednesday_business_from_time',
        },
        wednesdayBusinessEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'wednesday_business_end_time',
        },
        thursdayBusinessFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'thursday_business_from_time',
        },
        thursdayBusinessEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'thursday_business_end_time',
        },
        fridayBusinessFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'friday_business_from_time',
        },
        fridayBusinessEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'friday_business_end_time',
        },
        saturdayBusinessFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'saturday_business_from_time',
        },
        saturdayBusinessEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'saturday_business_end_time',
        },
        sundayBusinessFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'sunday_business_from_time',
        },
        sundayBusinessEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'sunday_business_end_time',
        },
        nationalHolidayBusinessFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'national_holiday_business_from_time',
        },
        nationalHolidayBusinessEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'national_holiday_business_end_time',
        },
        businessTimeDisplay: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'business_time_display',
        },
        isIncludeDisplayNationalHoliday: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'is_include_display_national_holiday',
        },
        businessTimeComment: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'business_time_comment',
        },
        tuesdayReceptionFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'tuesday_reception_from_time',
        },
        tuesdayReceptionEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'tuesday_reception_end_time',
        },
        mondayReceptionFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'monday_reception_from_time',
        },
        mondayReceptionEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'monday_reception_end_time',
        },
        wednesdayReceptionFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'wednesday_reception_from_time',
        },
        wednesdayReceptionEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'wednesday_reception_end_time',
        },
        thursdayReceptionFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'thursday_reception_from_time',
        },
        thursdayReceptionEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'thursday_reception_end_time',
        },
        fridayReceptionFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'friday_reception_from_time',
        },
        fridayReceptionEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'friday_reception_end_time',
        },
        saturdayReceptionFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'saturday_reception_from_time',
        },
        saturdayReceptionEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'saturday_reception_end_time',
        },
        sundayReceptionFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'sunday_reception_from_time',
        },
        sundayReceptionEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'sunday_reception_end_time',
        },
        nationalHolidayReceptionFromTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'national_holiday_reception_from_time',
        },
        nationalHolidayReceptionEndTime: {
          type: DataTypes.TIME,
          allowNull: true,
          field: 'national_holiday_reception_end_time',
        },
        canIssueTerminalCertificate: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'can_issue_terminal_certificate',
        },
        useTerminalCertificate: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'use_terminal_certificate',
        },
        canEditSelfInfo: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'can_edit_self_info',
        },
        canManageStaff: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'can_manage_staff',
        },
        isPublic: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'is_public',
        },
        isBusinessSetting: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'is_business_setting',
        },
        existLogoImage: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'exist_logo_image',
        },
        existStoreImage: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          field: 'exist_store_image',
        },
        shopId: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'shop_id',
        },
        shopPass: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'shop_pass',
        },
        siteId: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'site_id',
        },
        sitePass: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'site_pass',
        },
        logoImage: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'logo_image',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'LP_STORE_SSO',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'store_id' }],
          },
        ],
      },
    );
  }
}
