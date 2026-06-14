export default function JobsLoading() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Dark Header Banner Skeleton */}
      <section className="hero-glow hero-grid w-full py-16 md:py-20 px-[5%] text-center bg-background relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="h-12 w-64 md:w-96 bg-border-color rounded-lg animate-pulse mb-4"></div>
          <div className="h-6 w-48 bg-border-color/50 rounded-lg animate-pulse"></div>
        </div>
      </section>

      {/* Smooth transition */}
      <div className="section-transition-dark-to-light w-full" />

      {/* Light Content Area */}
      <section className="section-light w-full pb-20 px-[5%]">
        <div className="max-w-[1200px] w-full mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 mt-[-30px] pt-10">
          
          {/* Sidebar Skeleton */}
          <aside className="w-full lg:w-[280px] flex-shrink-0">
             <div className="h-10 w-full bg-border-light-secondary rounded-lg animate-pulse mb-8"></div>
             {[1, 2, 3].map(i => (
               <div key={i} className="mb-6">
                 <div className="h-4 w-24 bg-border-light-secondary rounded animate-pulse mb-4"></div>
                 <div className="flex flex-col gap-3">
                   {[1, 2, 3, 4].map(j => (
                     <div key={`sidebar-${i}-${j}`} className="flex items-center gap-3">
                       <div className="w-4 h-4 rounded bg-border-light animate-pulse"></div>
                       <div className="h-4 w-32 bg-border-light rounded animate-pulse"></div>
                     </div>
                   ))}
                 </div>
               </div>
             ))}
          </aside>

          {/* Main List Skeleton */}
          <main className="flex-grow flex flex-col gap-4 w-full">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card-light p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-pulse">
                <div className="flex gap-6 w-full items-start">
                  {/* Logo Skeleton */}
                  <div className="w-16 h-16 rounded-xl bg-bg-light-secondary border border-border-light flex-shrink-0"></div>
                  
                  {/* Content Skeleton */}
                  <div className="flex flex-col gap-3 flex-grow mt-1">
                    <div className="h-6 w-3/4 max-w-[300px] bg-border-light-secondary rounded"></div>
                    <div className="h-4 w-1/2 max-w-[200px] bg-border-light rounded"></div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="h-6 w-20 bg-bg-light-tertiary rounded-full"></div>
                      <div className="h-6 w-24 bg-bg-light-tertiary rounded-full"></div>
                      <div className="h-6 w-16 bg-bg-light-tertiary rounded-full"></div>
                    </div>
                  </div>
                </div>
                {/* Button Skeleton */}
                <div className="w-full md:w-[120px] h-11 bg-border-light-secondary rounded-lg md:ml-6 mt-4 md:mt-0 flex-shrink-0"></div>
              </div>
            ))}
          </main>

        </div>
      </section>
    </div>
  );
}
