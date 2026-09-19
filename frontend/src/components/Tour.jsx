import {Joyride, STATUS, EVENTS } from 'react-joyride'
import { markTourSeen } from '../utils/tour'
import sankofa from '../assets/adinkra/sankofa.svg'

function buildSteps({ userIsAdmin, showPlatformNav }) {
  const sidebarSteps = [
    {
      target: '[data-tour="nav-dashboard"]',
      title: 'Dashboard',
      content: 'Your home base — a live snapshot of stock, recent activity and anything that needs attention.',
      disableBeacon: true,
    },
    { target: '[data-tour="nav-products"]', title: 'Products', content: 'Add, edit and browse every product your business carries.' },
    { target: '[data-tour="nav-categories"]', title: 'Categories', content: 'Group your products so they stay organized as your catalog grows.' },
    { target: '[data-tour="nav-suppliers"]', title: 'Suppliers', content: 'Keep track of who you buy from, and link products to their suppliers.' },
    { target: '[data-tour="nav-inventory"]', title: 'Inventory', content: 'See exactly how much of everything you have, all in one place.' },
    { target: '[data-tour="nav-stock-in"]', title: 'Stock In', content: 'Log new stock as it arrives — quantities update automatically.' },
    { target: '[data-tour="nav-stock-out"]', title: 'Stock Out', content: 'Record sales or stock leaving, and keep your numbers accurate.' },
    { target: '[data-tour="nav-low-stock"]', title: 'Low Stock', content: "A running list of anything that's running low, so you're never caught off guard." },
    { target: '[data-tour="nav-history"]', title: 'History', content: 'A full timeline of every stock movement your team has made.' },
  ]

  if (userIsAdmin) {
    sidebarSteps.push({ target: '[data-tour="nav-reports"]', title: 'Reports', content: 'Export CSV reports of your inventory activity anytime.' })
    sidebarSteps.push({ target: '[data-tour="nav-team"]', title: 'Team', content: 'Manage who has access to your business and what they can do.' })
  }

  if (showPlatformNav) {
    sidebarSteps.push({ target: '[data-tour="nav-platform"]', title: 'All Businesses', content: 'As platform owner, you can see and manage every business on In-Stock from here.' })
  }

  sidebarSteps.push({
    target: '[data-tour="user-card"]',
    title: "That's you",
    content: 'Your name, role and business — always visible here.',
  })

  const mainSteps = [
    { target: '[data-tour="quick-actions"]', title: 'Quick actions', content: 'The fastest way to record stock coming in, going out, or add a brand new product.' },
    { target: '[data-tour="stats-grid"]', title: 'Your numbers at a glance', content: 'Total products, total stock on hand, and anything currently out of stock — updated live.' },
    { target: '[data-tour="notification-bell"]', title: 'Stay notified', content: "You'll get an alert here whenever something needs your attention, like low stock." },
  ]

  return { sidebarSteps, allSteps: [...sidebarSteps, ...mainSteps] }
}

function Tour({ run, onFinish, onSidebarSectionDone, userIsAdmin, showPlatformNav, userId }) {
  const { sidebarSteps, allSteps } = buildSteps({ userIsAdmin, showPlatformNav })
  const sidebarStepCount = sidebarSteps.length

  function handleCallback(data) {
    const { index, status, type } = data

    if (type === EVENTS.STEP_AFTER && index === sidebarStepCount - 1) {
      onSidebarSectionDone?.()
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      markTourSeen(userId)
      onFinish?.()
    }
  }

  return (
    <Joyride
      steps={allSteps}
      run={run}
      debug 
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      callback={handleCallback}
      styles={{
        options: {
          primaryColor: '#344b2d',
          zIndex: 10000,
          arrowColor: '#fff',
          backgroundColor: '#fff',
          overlayColor: 'rgba(20, 26, 18, 0.55)',
          textColor: '#232d22',
          width: 340,
        },
        tooltip: {
          borderRadius: 16,
          padding: '20px 20px 16px',
          backgroundImage: `url(${sankofa})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom -10px right -10px',
          backgroundSize: '64px',
        },
        tooltipTitle: {
          fontSize: 16,
          fontWeight: 750,
          marginBottom: 6,
        },
        tooltipContent: {
          fontSize: 13,
          lineHeight: 1.6,
          padding: '4px 0 0',
        },
        buttonNext: {
          backgroundColor: '#344b2d',
          color: '#fff',
          borderRadius: 10,
          padding: '8px 16px',
          fontSize: 12,
          fontWeight: 750,
        },
        buttonBack: {
          color: '#5f635b',
          fontSize: 12,
          marginRight: 8,
        },
        buttonSkip: {
          color: '#a0a29b',
          fontSize: 11,
        },
      }}
    />
  )
}

export default Tour