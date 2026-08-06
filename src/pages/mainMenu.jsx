import MenuButtons from '../components/mainMenu/menuButtons'
import MenuFooter from '../components/mainMenu/menuFooter'
import MenuPanel from '../components/mainMenu/menuPanel'
import MenuTitle from '../components/mainMenu/menuTitle'

function MainMenu() {
  return (
    <main className="relative min-h-dvh overflow-hidden text-white">
      <div className="absolute inset-0" />

      <MenuPanel>
        <MenuTitle />
        <MenuButtons />
        <MenuFooter />
      </MenuPanel>
    </main>
  )
}

export default MainMenu
