import MenuButtons from '../components/mainMenu/menuButtons'
import MenuFooter from '../components/mainMenu/menuFooter'
import MenuPanel from '../components/mainMenu/menuPanel'
import MenuTitle from '../components/mainMenu/menuTitle'
import Scene from '../components/three/scene'

function MainMenu() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Scene />
      </div>

      <div className="absolute inset-0 bg-black/10" />

      <MenuPanel>
        <MenuTitle />
        <MenuButtons />
        <MenuFooter />
      </MenuPanel>
    </main>
  )
}

export default MainMenu
