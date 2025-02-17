/* Library Packages */
import { 
  FC, 
  useState,
  ReactNode,
  useRef
} from 'react'
import { toast } from 'react-toastify'
import { IncomingMessage } from 'http'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  SingleSignOn,
  Widget,
  useI18n,
  WhatsAppOTPInput
} from '@sirclo/nexus'
import ReCAPTCHA from 'react-google-recaptcha'
/* component */
import Breadcrumb from 'components/Breadcrumb/Breadcrumb'
import Placeholder from 'components/Placeholder'
import Loader from 'components/Loader/Loader'
/* styles */
import styles from 'public/scss/components/whatsappOTP/LoginRegisterOTP.module.scss'

type LoginRegisterOTPPropsType = {
  hasOtp: IncomingMessage
  hasGoogleAuth: IncomingMessage
  hasFacebookAuth: IncomingMessage
  title?: string
  type: "login" | "register"
  brand: any
  lng: string
  children?: ReactNode
}

const formClasses = {
  inputFormContainerClassName: styles.inputFormContainer,
  formWAContainerClassName: styles.formWAContainer,
  inputFormTitleClassName: styles.inputFormTitle,
  inputLabelClassName: styles.inputLabel,
  inputWANumberClassName: styles.inputWANumber,
  inputFormDescriptionClassName: styles.inputFormDescription,
  btnSubmitClassName: styles.btnSubmit,
  inputDescriptionClassName: styles.inputDescription,
}

const confirmationClasses = {
  confirmationContainerClassName: styles.confirmationContainer,
  confirmationBackContainerClassName: styles.confirmationBackContainer,
  confirmationBackLabelClassName: styles.confirmationBackLabel,
  confirmationHeaderTitleClassName: styles.confirmationHeaderTitle,
  confirmationHeaderSubtitleClassName: styles.confirmationHeaderSubtitle,
  noWhatsAppLabelClassName: styles.noWhatsAppLabel,
  anotherLoginMethodClassName: styles.anotherLoginMethod,
  confirmationButtonOTPClassName: styles.confirmationButtonOTP,
}

const verificationClasses = {
  verificationContainerClassName: styles.verificationContainer,
  verificationTitleClassName: styles.verificationTitle,
  infoLabelClassName: styles.infoLabel,
  footerLabelClassName: styles.footerLabel,
  btnResendOTPClassName: styles.btnResendOTP,
  btnChangeMethodClassName: styles.btnChangeMethod,
  fieldOTPInputContainerClassName: styles.fieldOTPInputContainer,
  fieldOTPInputClassName: styles.fieldOTPInput,
}

const chooseAccountClasses = {
  chooseAccountContainerClassName: styles.chooseAccountContainer,
  accountOptionsContainerClassName: styles.accountOptionsContainer,
  accountOptionClassName: styles.accountOption,
  accountNameClassName: styles.accountName,
  accountEmailClassName: styles.accountEmail,
  selectedAccountClassName: styles.selectedAccount,
  chooseAccountTitleClassName: styles.chooseAccountTitle,
  chooseAccountDescriptionClassName: styles.chooseAccountDescription,
  btnChooseAccountClassName: styles.btnChooseAccount,
}

const LoginRegisterOTP: FC<LoginRegisterOTPPropsType> = ({
  type,
  brand,
  hasOtp,
  children,
  title,
  hasGoogleAuth,
  hasFacebookAuth,
  lng
}) => {
  const i18n: any = useI18n()
  const router: any = useRouter()
  const query = router?.query || {}
  const recaptchaRef = useRef<any>()

  const steps = {
    email: "email",
    wa: "whatsapp-input"
  }

  const getReCAPTCHAToken = async () => {
    const token = await recaptchaRef.current.executeAsync()
    recaptchaRef.current.reset()
    return token
  }
  
  const [step, setStep] = useState<string>(steps.wa)

  const brandName = (brand: string): string => {
    const lower = brand?.toLowerCase()
    return brand?.charAt(0).toUpperCase() + lower?.slice(1)
  }

  const handleChangeStep = (step: string) => {
    if (step === steps.email) setStep('whatsapp-input')
    if (step === steps.wa) setStep('email')
  }

  const linksBreadcrumb = [`${i18n.t("header.home")}`, title]

  let customLocales = {}
  if (type === "register") customLocales = {
    continue: i18n.t("whatsAppOTPInputRegis.continue"),
    disclaimer: i18n.t("whatsAppOTPInputRegis.disclaimer"),
    inputWhatsApp: i18n.t("whatsAppOTPInputRegis.inputWhatsApp"),
    loginWithAnotherMethod: i18n.t("whatsAppOTPInputRegis.loginWithAnotherMethod"),
    chooseAnyAccountToLogin: i18n.t("whatsAppOTPInputRegis.chooseAnyAccountToLogin"),
  }

  return (
    <>
      {((step === steps.email || step === steps.wa) && title) &&
        <div className={styles.sectionBreadcumb}>
        <Breadcrumb
          title={title}
          links={linksBreadcrumb}
          lng={lng}
          fluidContainer
        />
      </div>
      }

      {step === steps.email || !hasOtp ?
        children
        :
        <WhatsAppOTPInput
        getReCAPTCHAToken={getReCAPTCHAToken}
          brandName={brandName(brand?.name)}
          onStepChange={setStep}
          classes={{
            ...formClasses,
            ...confirmationClasses,
            ...verificationClasses,
            ...chooseAccountClasses,
          }}
          inputPlaceholder={i18n.t("whatsAppOTPInput.inputPlaceholder")}
          onErrorMsg={(msg) => toast.error(msg)}
          loginRedirectPath="account"
          customLocales={customLocales}
        />
      }

      <Widget
        widgetClassName={styles.widgetLogin}
        pos="login-image"
        loadingComponent={
          <Placeholder
            classes={{
              placeholderImage: styles.widgetLogin
            }}
            withImage
          />
        }
      />

      {((step === steps.email || step === steps.wa) || type === "register") &&
        <div className={styles.footer}>
          {type === "register" ?
            i18n.t('register.haveAccount') :
            i18n.t('login.dontHaveAccount')
          } {' '}
          <Link
            href={{
              pathname: `/[lng]/${type === "register" ? "login" : "register"}`,
              query: query,
            }}
          >
            <a>
              {type === "register" ?
                i18n.t('login.title') :
                i18n.t('login.toRegister')
              }
            </a>
          </Link>
        </div>
      }

      {(step === steps.email || step === steps.wa) &&
        <>
        {(hasGoogleAuth || hasFacebookAuth || hasOtp) &&
            <div className={styles.ssoContainer}>
              {(hasGoogleAuth || hasFacebookAuth || hasOtp) &&
                <label className={styles.ssoOr}>
                  {i18n.t(`${type}.or`)}
                </label>
              }
              <div className={styles.ssoButtonContainer}>
                <SingleSignOn
                  className={""}
                  googleButtonSize={'large'}
                  googleButtonType={'icon'}
                  googleButtonTheme={'outline'}
                  googleButtonShape={'rectangular'}
                  googleButtonLogoAlignment={'center'}
                  loadingComponent={
                    <Loader color='text-dark' />
                  }
                />
                {hasOtp &&
                  <button
                    className={styles.buttonWaEmail}
                    onClick={() => handleChangeStep(step)}
                  >
                    <span className={step}></span>
                  </button>
                }
              </div>
            </div>
          }
        </>
      }
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_SITEKEY_RECAPTCHA}
        size='invisible'
      />
    </>
  )
}
export default LoginRegisterOTP