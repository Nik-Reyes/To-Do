import resizeSvgs from '../utils/ResizeSvgs.js';

export default class SidebarManager {
	constructor(els) {
		this.pageWrapper = els.pageWrapper;
		this.sidebar = els.sidebar;
		this.hamburger = els.headerHamburger;
		this.overlay = els.overlay;
		this.isSmallScreen = false;
		this.isSidebarOpen = false;
		this.isDeskPanelHidden = false;
		this.threshhold = 670; //px
	}

	updateByCurrentScreenSize() {
		const width = window.innerWidth;
		const prevScreenState = this.isSmallScreen; // if isSmallScreen is false, then its desktop
		this.isSmallScreen = width < this.threshhold; // if isSmallScreen is true, then screen is mobile
		if (prevScreenState !== this.isSmallScreen) {
			this.updateSidebarStates();
			this.updateElementClasses();
		}
	}

	updateSidebarStates() {
		//handles the view (desktop to mobile & mobile to desktop)
		//if user is on mobile but switches to desktop, the the desktop sidebar is shown
		//if the user is on desktop and switches to mobile the sidebar is hidden
		this.isDeskPanelHidden = false;
		this.isSidebarOpen = false;
		setTimeout(resizeSvgs, 1);
	}

	updateElementClasses() {
		if (this.isSmallScreen) {
			this.pageWrapper.classList.remove('desktop-sidebar');
			this.sidebar.classList.add('mobile');
			this.sidebar.classList.remove('desktop', 'hidden');
			this.sidebar.classList.toggle('open', this.isSidebarOpen);
			this.overlay.classList.toggle('active-overlay', this.isSidebarOpen);
		}
		//first updateElementClasses() in init() sees this.isDeskPanelHidden = false and adds the desktop sidebar
		else {
			this.sidebar.classList.add('desktop');
			this.sidebar.classList.remove('mobile', 'open');
			this.overlay.classList.remove('active-overlay');
			if (this.isDeskPanelHidden) {
				//if the user is on desktop and closes the sidebar, turn on mobile mode and hide the sidebar
				this.pageWrapper.classList.remove('desktop-sidebar');
				this.sidebar.classList.add('hidden');
			} else {
				//for when the user toggles the sidebar in dekstop mode: removes mobile view and add desktop view
				this.pageWrapper.classList.add('desktop-sidebar');
				this.sidebar.classList.remove('hidden');
			}
		}
	}

	toggleSidebar() {
		this.isSmallScreen
			? (this.isSidebarOpen = !this.isSidebarOpen)
			: (this.isDeskPanelHidden = !this.isDeskPanelHidden);

		this.updateElementClasses();
	}

	closeSidebar() {
		this.isSidebarOpen = false;
		this.updateElementClasses();
	}

	handleScreenResize() {
		this.updateByCurrentScreenSize();
	}

	applyEventListeners() {
		this.hamburger.addEventListener('click', this.toggleSidebar.bind(this));
		this.overlay.addEventListener('click', this.closeSidebar.bind(this));
		window.addEventListener('resize', this.handleScreenResize.bind(this));
	}

	init() {
		this.updateByCurrentScreenSize();
		this.updateElementClasses();
		this.applyEventListeners();
	}
}
