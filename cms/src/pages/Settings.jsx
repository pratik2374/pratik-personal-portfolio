import TopBar from '../components/layout/TopBar'
import SettingsForm from '../components/forms/SettingsForm'

export default function Settings() {
  return (
    <>
      <TopBar title="Settings" />
      <div className="p-8">
        <p className="text-gray-mid text-sm mb-8">Edit your portfolio's hero content and social links.</p>
        <SettingsForm />
      </div>
    </>
  )
}
