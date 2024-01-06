from sqlalchemy import Enum
# from sqlalchemy.dialects.postgresql import ENUM

genders = ('masculino', 'femenino')
Gender = Enum(*genders, name='gender_enum')

countries = ('AD' 'AD',  'AE',  'AF',  'AG',  'AI',  'AL',  'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ','CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW')
Country = Enum(*countries, name='country_enum')

civil_status = ('casado', 'soltero', 'divorciado', 'union libre')
CivilStatus = Enum(*civil_status,  name='civil_status_enum')

lives_with = ('mama', 'papa', 'otro')
LivesWith = Enum(*lives_with, name='lives_with_enum')

stundent_levels = ('inicial', 'primario', 'secundario')
StudentLevels = Enum(*stundent_levels, name='students_levels_enum')

hepatitis = ('1era', '2da', '3era')
Hepatitis = Enum(*hepatitis, name='hepatitis_enums')

influenza = ('1era', '2da', 'refuerzo anual')
Influenza = Enum(*influenza, name='influenza_enum')

spr = ('1era')
SPR = Enum(spr, name='spr_enum')

dpt = ('2da', 'refuerzo')
DPT = Enum(*dpt, name='dpt_enum')

neumoco = ('refuerzo')
Neumoco = Enum(neumoco, name='neumoco_enum')

bopv = ('1era', 'refuerzo')
Bopv = Enum(*bopv, name='bopv_enum')

covid = ('1era', '2da')
Covid = Enum(*covid, name='covid_enum')

vph = ('1era', '2da')
VPH = Enum(*vph, name='vph_enum')

dt = ('3era', 'refuerzo')
DT = Enum(*dt, name='dt_enum')

pregnant_tdan = ('1era')
PregnantTDAN = Enum(pregnant_tdan, name='pregnant_tdan_enum')

pregnant_influenza = ('1era')
PregnantInfluenza = Enum(pregnant_influenza, name='pregnant_influenza_enum')

student_status = ('nuevo inscrito', 'retirado', 'repitiente', 'reingreso', 'aplazado')
StudentStatus = Enum(*student_status, name='student_status_enum')