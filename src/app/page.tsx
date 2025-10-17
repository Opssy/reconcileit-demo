import Navbar from "@/components/layouts/Navbar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Banner Section */}
      <section className="relative py-20 lg:py-32" style={{ backgroundColor: '#13362a' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white font-polymath mb-6">
              Simplify Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                {" "}Data Reconciliation
              </span>
            </h1>
            <p className="text-xl text-slate-200 font-polymath mb-8 max-w-3xl mx-auto">
              Streamline your data workflows with intelligent automation.
              Reconcile your transactions data, manage data, and gain insights faster than ever before.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a href="/register" className="group">
                <button className="w-full sm:w-auto bg-[#90e39a] text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#90e39a]/90 transition-all duration-200 font-polymath shadow-lg hover:shadow-xl">
                  Get Started Free
                </button>
              </a>
              <a href="/login" className="group">
                <button className="w-full sm:w-auto border-2 border-slate-300 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-200 font-polymath">
                  Sign In
                </button>
              </a>
            </div>

            {/* Trusted By Section - Below Buttons */}
            <div className="flex flex-col items-center">
              <p className="text-sm text-slate-300 font-polymath mb-8 uppercase tracking-wider text-center">
                Trusted by 30+ Global Companies
              </p>

              <div className="relative overflow-hidden w-full">
                {/* <div className="flex justify-center animate-scroll-left"> */}
                <div className="flex justify-center">
                  {/* First set of logos */}
                  <div className="flex items-center space-x-8 mx-4">
                    <div className="w-32 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 p-2">
                      <img src="/images/nlng.png" alt="NLNG" className="w-full h-full object-contain" />
                    </div>
                    <div className="w-32 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 p-2">
                      <img src="/images/polaris.png" alt="Polaris Bank" className="w-full h-full object-contain" />
                    </div>
                    <div className="w-32 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 p-2">
                      <img src="/images/providus.png" alt="Providus Bank" className="w-full h-full object-contain" />
                    </div>
                    <div className="w-32 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 p-2">
                      <img src="/images/seplat.png" alt="Seplat" className="w-full h-full object-contain" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      </section>
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 font-polymath mb-4">
              Everything you need for seamless reconciliation
            </h2>
            <p className="text-lg text-slate-600 font-polymath max-w-2xl mx-auto">
              Powerful tools designed to make financial reconciliation effortless and accurate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 font-polymath mb-4">Automated Matching</h3>
              <p className="text-slate-600 font-polymath">
                Intelligent algorithms automatically match and reconcile your financial transactions with precision.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 font-polymath mb-4">Real-time Processing</h3>
              <p className="text-slate-600 font-polymath">
                Process large volumes of data in real-time with our high-performance reconciliation engine.
              </p>
            </div>

            <div className="text-center p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 font-polymath mb-4">Advanced Analytics</h3>
              <p className="text-slate-600 font-polymath">
                Gain deep insights into your financial data with comprehensive reporting and analytics tools.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 font-polymath mb-6">
            Ready to transform your reconciliation process?
          </h2>
          <p className="text-lg text-slate-600 font-polymath mb-8">
            Join thousands of businesses already using ReconcileIt to streamline their financial operations.
          </p>
          <a href="/register">
            <button className="bg-[#90e39a] text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#90e39a]/90 transition-all duration-200 font-polymath shadow-lg hover:shadow-xl">
              Start Free Trial
            </button>
          </a>
        </div>
      </section> */}
    </div>
  );
};

export default HomePage;