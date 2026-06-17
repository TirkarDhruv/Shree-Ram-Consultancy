import React, { useEffect, useMemo, useState } from 'react'

const BACKEND_ORIGIN = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Shree%20Ram%20Consultancy%20Nr.%20Shitalchhaya%20Cross%20Road%20Arbudanagar%20Odhav%20Ahmedabad%20382415'

const DEFAULT_CONFIG = {
  business: {
    name: 'Shree Ram Consultancy',
    address: 'Nr. Shitalchhaya Cross Road, Arbudanagar, Odhav, Ahmedabad - 382415',
    phone: '+917069320318',
    whatsapp: '917069320318',
    hours: '10:00 AM - 6:00 PM',
    openNow: true
  },
  services: [
    {
      id: 'insurance',
      title: 'Insurance Services',
      description: 'Policy guidance, renewals, and claim-ready documentation.',
      services: ['Motor Insurance', 'Health Insurance', 'Fire Insurance']
    },
    {
      id: 'govt',
      title: 'Government ID & Cards',
      description: 'Application support for essential identity and benefit cards.',
      services: ['Aadhar Card', 'Pan Card', 'Election Card', 'Ayushman Card', 'E-shram Card', 'Abha Card', 'Passport']
    },
    {
      id: 'rto',
      title: 'RTO & Vehicle Works',
      description: 'Vehicle transfer, licence, and practical RTO advisory work.',
      services: ['Driving Licence', 'Vehicle Transfer', 'RTO Advisor']
    },
    {
      id: 'business',
      title: 'Business & Tax Registration',
      description: 'Registration and compliance help for small businesses.',
      services: ['IT Return', 'MSME Registration', 'FSSAI', 'PF']
    }
  ],
  leadStatuses: ['New', 'Contacted', 'In Progress', 'Closed']
}

function formatDate(value) {
  if (!value) return '-'

  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

function statusClass(status) {
  const classes = {
    New: 'bg-amber-100 text-amber-800 border-amber-200',
    Contacted: 'bg-sky-100 text-sky-800 border-sky-200',
    'In Progress': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    Closed: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }

  return classes[status] || 'bg-slate-100 text-slate-700 border-slate-200'
}

function canGoBackSafely() {
  if (window.history.length <= 1) {
    return false
  }

  if (!document.referrer) {
    return true
  }

  try {
    return new URL(document.referrer).origin === window.location.origin
  } catch (err) {
    return false
  }
}

function goBackOrHome() {
  if (canGoBackSafely()) {
    window.history.back()
    return
  }

  window.location.href = '/'
}

function pageLabel(pathname) {
  if (pathname.startsWith('/services')) return 'Services'
  if (pathname.startsWith('/callback')) return 'Callback'
  if (pathname.startsWith('/admin')) return 'Admin'
  return 'Home'
}

function BackButton({ className = '' }) {
  const currentPath = window.location.pathname

  if (currentPath === '/') {
    return null
  }

  const fallbackLabel = currentPath.startsWith('/admin') ? 'Back to site' : 'Back'

  return (
    <button
      type="button"
      className={`group inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-x-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 sm:h-10 sm:px-2.5 ${className}`}
      onClick={goBackOrHome}
      aria-label={`${fallbackLabel} or go home`}
      title={fallbackLabel}
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-emerald-100 group-hover:text-emerald-900" aria-hidden="true">
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="hidden lg:inline">{fallbackLabel}</span>
    </button>
  )
}

function Breadcrumbs() {
  const currentPath = window.location.pathname

  if (currentPath === '/') {
    return null
  }

  return (
    <div className="border-t border-stone-200/70 bg-white/45">
      <nav className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs font-medium text-slate-500" aria-label="Breadcrumb">
        <a className="hover:text-slate-950" href="/">Home</a>
        <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-slate-800">{pageLabel(currentPath)}</span>
      </nav>
    </div>
  )
}

function SiteHeader({ businessName, trailingAction = null }) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function closeMenu() {
      setMenuOpen(false)
    }

    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('click', closeMenu)
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      window.removeEventListener('click', closeMenu)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#f7f4ee]/95 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
        <BackButton />
        <a href="/" className="min-w-0 justify-self-start text-[14px] font-semibold leading-tight tracking-tight text-slate-950 sm:text-lg">
          {businessName}
        </a>
        <div className="flex shrink-0 items-center gap-1.5 justify-self-end sm:gap-2">
          {trailingAction}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="inline-grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-950 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 sm:h-10 sm:w-10"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="Open navigation menu"
              title="Menu"
            >
              <span className="sr-only">Menu</span>
              <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            {menuOpen && (
              <nav className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl" aria-label="Main menu">
                <a className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950" href="/">Home</a>
                <a className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950" href="/services">Services</a>
                <a className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950" href="/callback">Callback</a>
                <a className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950" href="/admin">Admin</a>
              </nav>
            )}
          </div>
        </div>
      </div>
      <Breadcrumbs />
    </header>
  )
}

function SiteFooter({ config, services }) {
  const highlightedServices = services.slice(0, 6)

  return (
    <footer className="border-t border-stone-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="text-xl font-semibold">{config.business.name}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
            Local support for insurance, government documents, RTO work, and small business registration in Odhav, Ahmedabad.
          </p>
          <a
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
          >
            <span aria-hidden="true">⌖</span>
            Open shop location
          </a>
        </div>

        <div>
          <p className="font-semibold">Quick links</p>
          <nav className="mt-3 grid gap-2 text-sm">
            <a className="text-slate-300 hover:text-white" href="/services">Services</a>
            <a className="text-slate-300 hover:text-white" href="/callback">Request callback</a>
            <a className="text-slate-300 hover:text-white" href="/admin">Admin login</a>
            <a className="text-slate-300 hover:text-white" href={`tel:${config.business.phone}`}>Call now</a>
          </nav>
        </div>

        <div>
          <p className="font-semibold">Visit or contact</p>
          <div className="mt-3 space-y-3 text-sm text-slate-300">
            <a className="block leading-6 hover:text-white" href={MAPS_URL} target="_blank" rel="noreferrer">
              {config.business.address}
            </a>
            <a className="block hover:text-white" href={`tel:${config.business.phone}`}>{config.business.phone}</a>
            <p>{config.business.hours}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 px-4 py-4 text-xs text-slate-400 md:flex-row">
          <p>© {new Date().getFullYear()} {config.business.name}</p>
          <p>{highlightedServices.join(' • ')}</p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const currentPath = window.location.pathname
  const isAdminPath = currentPath.startsWith('/admin')
  const isServicesPath = currentPath.startsWith('/services')
  const isCallbackPath = currentPath.startsWith('/callback')
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CONFIG.services[0].id)
  const allServices = useMemo(() => config.services.flatMap((category) => category.services), [config.services])

  const [form, setForm] = useState({ name: '', phone: '', service: DEFAULT_CONFIG.services[0].services[0], message: '' })
  const [leadStatus, setLeadStatus] = useState(null)
  const [submittingLead, setSubmittingLead] = useState(false)

  const [adminLogin, setAdminLogin] = useState({ username: '', password: '' })
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'))
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || '')
  const [adminLeads, setAdminLeads] = useState([])
  const [adminMeta, setAdminMeta] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 })
  const [adminPage, setAdminPage] = useState(1)
  const [adminFilter, setAdminFilter] = useState('')
  const [adminError, setAdminError] = useState(null)
  const [loadingLeads, setLoadingLeads] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadConfig() {
      try {
        const response = await fetch(`${BACKEND_ORIGIN}/api/config`)

        if (!response.ok) return

        const data = await response.json()

        if (!ignore) {
          setConfig(data)
          setSelectedCategory(data.services?.[0]?.id || DEFAULT_CONFIG.services[0].id)
          setForm((current) => ({
            ...current,
            service: data.services?.flatMap((category) => category.services)?.[0] || current.service
          }))
        }
      } catch (err) {
        if (!ignore) {
          console.warn('Using fallback site config')
        }
      }
    }

    loadConfig()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!isAdminPath || !adminToken) return

    loadAdminLeads(adminToken, adminPage, adminFilter)
  }, [isAdminPath, adminToken, adminPage, adminFilter])

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get('service')

    if (requestedService && allServices.includes(requestedService)) {
      setForm((current) => ({ ...current, service: requestedService }))
    }
  }, [allServices])

  async function loadAdminLeads(token, page = 1, status = '') {
    setLoadingLeads(true)
    setAdminError(null)

    try {
      const params = new URLSearchParams({ page: String(page), limit: '25' })

      if (status) {
        params.set('status', status)
      }

      const res = await fetch(`${BACKEND_ORIGIN}/api/admin/leads?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          signOut()
          setAdminError('Admin session expired. Please sign in again.')
          return
        }

        throw new Error('Unable to load leads')
      }

      const payload = await res.json()
      setAdminLeads(payload.data || [])
      setAdminMeta(payload.meta || { page, limit: 25, total: 0, totalPages: 1 })
    } catch (err) {
      setAdminError(err.message)
    } finally {
      setLoadingLeads(false)
    }
  }

  async function handleAdminLogin(e) {
    e.preventDefault()
    setAdminError(null)

    try {
      const res = await fetch(`${BACKEND_ORIGIN}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminLogin)
      })
      const data = await res.json()

      if (!res.ok) {
        setAdminError(data.error || 'Admin login failed')
        return
      }

      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminName', data.username || adminLogin.username)
      setAdminToken(data.token)
      setAdminName(data.username || adminLogin.username)
      setAdminLogin({ username: '', password: '' })
      setAdminPage(1)
      loadAdminLeads(data.token, 1, adminFilter)
    } catch (err) {
      setAdminError('Admin login failed')
    }
  }

  async function updateLeadStatus(id, status) {
    setAdminError(null)

    try {
      const response = await fetch(`${BACKEND_ORIGIN}/api/admin/leads/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Unable to update lead status')
      }

      setAdminLeads((leads) => leads.map((lead) => (lead.id === id ? { ...lead, status } : lead)))
    } catch (err) {
      setAdminError(err.message)
    }
  }

  function signOut() {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminName')
    setAdminToken(null)
    setAdminName('')
    setAdminLeads([])
  }

  async function submitLead(e) {
    e.preventDefault()
    setLeadStatus(null)
    setSubmittingLead(true)

    try {
      const resp = await fetch(`${BACKEND_ORIGIN}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, language: 'en' })
      })
      const data = await resp.json()

      if (resp.ok) {
        setLeadStatus({ type: 'success', message: 'Request received. We will contact you soon.' })
        setForm({ name: '', phone: '', service: allServices[0] || '', message: '' })
      } else {
        setLeadStatus({ type: 'error', message: data.error || 'Submission failed' })
      }
    } catch (err) {
      setLeadStatus({ type: 'error', message: 'Network error. Please try calling or WhatsApp.' })
    } finally {
      setSubmittingLead(false)
    }
  }

  function waLink(service) {
    const text = encodeURIComponent(`Hello Shree Ram Consultancy, I need info about ${service}`)
    return `https://wa.me/${config.business.whatsapp}?text=${text}`
  }

  const selectedCategoryData = config.services.find((category) => category.id === selectedCategory) || config.services[0]
  const renderCallbackForm = () => (
    <form onSubmit={submitLead} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Mobile</span>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="10-digit mobile"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            inputMode="numeric"
            required
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">Service</span>
        <select
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        >
          {allServices.map((service) => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className="text-sm font-medium text-slate-700">Message</span>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us what you need"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          rows={4}
        />
      </label>

      <button
        type="submit"
        className="mt-5 w-full rounded-lg bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={submittingLead}
      >
        {submittingLead ? 'Sending...' : 'Send request'}
      </button>

      {leadStatus && (
        <p className={`mt-4 rounded-lg border px-3 py-2 text-sm ${
          leadStatus.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-red-200 bg-red-50 text-red-700'
        }`}>
          {leadStatus.message}
        </p>
      )}
    </form>
  )

	  if (isAdminPath) {
	    return (
	      <main className="min-h-screen bg-slate-100 text-slate-950">
	        <SiteHeader
	          businessName={config.business.name}
	          trailingAction={adminToken ? (
	            <button className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 sm:px-4 sm:text-sm" onClick={signOut}>
	              Sign out
	            </button>
	          ) : null}
	        />

        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase text-emerald-700">Admin Workspace</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Lead management</h1>
            <p className="mt-2 max-w-2xl text-slate-600">Review new requests, update follow-up status, and keep daily work organized.</p>
          </div>

          {adminToken ? (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Signed in</p>
                  <p className="mt-1 font-semibold">{adminName || 'Admin'}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Total leads</p>
                  <p className="mt-1 text-2xl font-semibold">{adminMeta.total}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Current page</p>
                  <p className="mt-1 text-2xl font-semibold">{adminMeta.page}</p>
                </div>
                <label className="rounded-lg border border-slate-200 bg-white p-4">
                  <span className="text-sm text-slate-500">Status filter</span>
                  <select
                    value={adminFilter}
                    onChange={(e) => {
                      setAdminPage(1)
                      setAdminFilter(e.target.value)
                    }}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">All statuses</option>
                    {config.leadStatuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <h2 className="font-semibold">Recent leads</h2>
                  <button
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => loadAdminLeads(adminToken, adminPage, adminFilter)}
                  >
                    Refresh
                  </button>
                </div>

                {adminError && <p className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{adminError}</p>}

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Service</th>
                        <th className="px-4 py-3">Message</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Received</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loadingLeads ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-6 text-slate-500">Loading leads...</td>
                        </tr>
                      ) : adminLeads.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-4 py-6 text-slate-500">No leads found.</td>
                        </tr>
                      ) : (
                        adminLeads.map((lead) => (
                          <tr key={lead.id} className="align-top">
                            <td className="px-4 py-3">
                              <p className="font-medium text-slate-950">{lead.name}</p>
                              <a className="text-sky-700 hover:underline" href={`tel:${lead.phone}`}>{lead.phone}</a>
                            </td>
                            <td className="px-4 py-3 text-slate-700">{lead.service}</td>
                            <td className="max-w-xs px-4 py-3 text-slate-600">{lead.message || '-'}</td>
                            <td className="px-4 py-3">
                              <select
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                className={`rounded-lg border px-2 py-1 text-xs font-semibold ${statusClass(lead.status)}`}
                              >
                                {config.leadStatuses.map((status) => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{formatDate(lead.created_at)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
                  <p className="text-sm text-slate-500">Page {adminMeta.page} of {adminMeta.totalPages}</p>
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={adminPage <= 1}
                      onClick={() => setAdminPage((page) => Math.max(1, page - 1))}
                    >
                      Previous
                    </button>
                    <button
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={adminPage >= adminMeta.totalPages}
                      onClick={() => setAdminPage((page) => page + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAdminLogin} className="max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">Admin sign in</h2>
              <p className="mt-2 text-sm text-slate-600">Use the credentials from backend `.env` to access leads.</p>
              <div className="mt-5 space-y-3">
                <input
                  value={adminLogin.username}
                  onChange={(e) => setAdminLogin({ ...adminLogin, username: e.target.value })}
                  placeholder="Username"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  autoComplete="username"
                  required
                />
                <input
                  value={adminLogin.password}
                  onChange={(e) => setAdminLogin({ ...adminLogin, password: e.target.value })}
                  placeholder="Password"
                  type="password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  autoComplete="current-password"
                  required
                />
                <button type="submit" className="w-full rounded-lg bg-slate-950 py-2 font-medium text-white hover:bg-slate-800">Sign in</button>
              </div>
              {adminError && <p className="mt-4 text-sm text-red-600">{adminError}</p>}
            </form>
          )}
        </section>
      </main>
	    )
	  }

  if (isServicesPath) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] text-slate-950">
        <SiteHeader businessName={config.business.name} />

        <section className="border-b border-stone-200">
          <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
            <p className="text-sm font-semibold uppercase text-emerald-700">Services</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">Find the right service quickly.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">Pick a category, review the related work, then call, WhatsApp, or request a callback.</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-6 md:py-10">
          <div className="-mx-4 overflow-x-auto px-4 pb-2">
            <div className="flex min-w-max gap-2 md:grid md:min-w-0 md:grid-cols-4">
              {config.services.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id)
                    setForm((current) => ({ ...current, service: category.services[0] }))
                  }}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition md:rounded-lg md:px-4 md:py-3 md:text-left ${
                    selectedCategory === category.id
                      ? 'border-emerald-700 bg-emerald-700 text-white shadow-sm'
                      : 'border-stone-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          <article className="mt-4 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{selectedCategoryData.services.length} services available</p>
              <h2 className="mt-2 text-2xl font-semibold">{selectedCategoryData.title}</h2>
              <p className="mt-2 leading-7 text-slate-600">{selectedCategoryData.description}</p>
            </div>

            <div className="divide-y divide-slate-100">
              {selectedCategoryData.services.map((service) => (
                <div key={service} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{service}</p>
                    <p className="mt-1 text-sm text-slate-500">Get document checklist and next-step guidance.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white" href={`tel:${config.business.phone}`}>Call</a>
                    <a className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700" href={waLink(service)} target="_blank" rel="noreferrer">WhatsApp</a>
                    <a className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700" href={`/callback?service=${encodeURIComponent(service)}`}>Callback</a>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <div className="mt-6 hidden gap-5 lg:grid lg:grid-cols-4">
            {config.services.map((category) => (
              <article key={category.id} className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="border-b border-slate-100 pb-4">
                  <p className="text-xs font-semibold uppercase text-emerald-700">{category.services.length} services</p>
                  <h3 className="mt-2 font-semibold">{category.title}</h3>
                </div>
                <div className="mt-3 grid gap-2">
                  {category.services.map((service) => (
                    <a key={service} className="text-sm text-slate-600 hover:text-emerald-800" href={`/callback?service=${encodeURIComponent(service)}`}>{service}</a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 py-8 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold">Need help choosing the right service?</h2>
              <p className="mt-2 text-slate-600">Send a callback request and the team can guide you.</p>
            </div>
            <a className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800" href="/callback">Request callback</a>
          </div>
        </section>

        <SiteFooter config={config} services={allServices} />
      </main>
    )
  }

  if (isCallbackPath) {
    return (
      <main className="min-h-screen bg-[#f7f4ee] text-slate-950">
        <SiteHeader businessName={config.business.name} />

        <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">Callback</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">Tell us what work you need.</h1>
            <p className="mt-4 text-lg text-slate-700">Submit your details and the team can call back with the correct process, documents, and expected next step.</p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <p className="font-semibold">Fast contact</p>
                <a className="mt-2 block text-sky-700 hover:underline" href={`tel:${config.business.phone}`}>{config.business.phone}</a>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <p className="font-semibold">Office address</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{config.business.address}</p>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <p className="font-semibold">Working hours</p>
                <p className="mt-2 text-sm text-slate-600">{config.business.hours}</p>
              </div>
            </div>
          </div>

          {renderCallbackForm()}
        </section>

        <SiteFooter config={config} services={allServices} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-slate-950">
      <SiteHeader businessName={config.business.name} />

      <section className="border-b border-stone-200 bg-[#f7f4ee]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">Local consultancy in Odhav</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
              Insurance, documents, RTO and business work handled with clarity.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-700">
              Get practical guidance, correct paperwork, and quick follow-up for everyday public service and policy needs.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800" href={`tel:${config.business.phone}`}>Call now</a>
              <a className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-50" href={waLink(form.service)} target="_blank" rel="noreferrer">WhatsApp</a>
              <a className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-950 hover:bg-white" href="/callback">Request callback</a>
            </div>
          </div>

          <aside className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="border-b border-slate-100 pb-4">
              <p className="text-sm text-slate-500">Today</p>
              <p className="mt-1 text-2xl font-semibold">{config.business.openNow ? 'Open for consultation' : 'Closed right now'}</p>
              <p className="mt-1 text-slate-600">{config.business.hours}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 py-4">
              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-2xl font-semibold text-emerald-900">{allServices.length}+</p>
                <p className="text-sm text-emerald-800">Services</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-2xl font-semibold text-amber-900">4</p>
                <p className="text-sm text-amber-800">Main categories</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-600">{config.business.address}</p>
          </aside>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">What we handle</p>
            <h2 className="mt-2 text-3xl font-semibold">Choose a service category</h2>
          </div>
          <p className="max-w-xl text-slate-600">Select the work you need, call directly, or send a callback request with the same service pre-filled.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
          <div className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:overflow-visible md:px-0 md:pb-0">
            <div className="flex min-w-max gap-2 md:grid md:min-w-0 md:gap-3">
            {config.services.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setForm((current) => ({ ...current, service: category.services[0] }))
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition md:rounded-lg md:p-4 md:text-left ${
                  selectedCategory === category.id
                    ? 'border-emerald-700 bg-emerald-700 text-white shadow-sm'
                    : 'border-stone-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                <p className="font-semibold">{category.title}</p>
                <p className={`mt-1 hidden text-sm md:block ${selectedCategory === category.id ? 'text-emerald-50' : 'text-slate-600'}`}>{category.description}</p>
              </button>
            ))}
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{selectedCategoryData.services.length} services</p>
            <h3 className="mt-2 text-xl font-semibold">{selectedCategoryData.title}</h3>
            <p className="mt-2 text-slate-600">{selectedCategoryData.description}</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {selectedCategoryData.services.map((service) => (
                <article key={service} className="rounded-lg border border-slate-200 p-3">
                  <h4 className="text-sm font-semibold">{service}</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-medium text-white" href={`tel:${config.business.phone}`}>Call</a>
                    <a className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700" href={waLink(service)} target="_blank" rel="noreferrer">WhatsApp</a>
                    <button
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
                      onClick={() => {
                        setForm((current) => ({ ...current, service }))
                        window.location.href = `/callback?service=${encodeURIComponent(service)}`
                      }}
                    >
                      Enquire
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="callback" className="border-y border-stone-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">Quick request</p>
            <h2 className="mt-2 text-3xl font-semibold">Request a callback</h2>
            <p className="mt-3 text-slate-600">Share your name, phone, and service. The team can call back with the right document list and next steps.</p>
            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold">Direct contact</p>
              <a className="mt-2 block text-sky-700 hover:underline" href={`tel:${config.business.phone}`}>{config.business.phone}</a>
              <p className="mt-2 text-sm text-slate-600">{config.business.address}</p>
            </div>
          </div>

          {renderCallbackForm()}
        </div>
      </section>

      <SiteFooter config={config} services={allServices} />
    </main>
  )
}
