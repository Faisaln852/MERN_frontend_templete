// app/admin/page.tsx
"use client"
import { SiteHeader } from "@/app/admin/layout/site-header"
import { ChartAreaInteractive } from "@/app/admin/layout/chart-area-interactive"
import { DataTable } from "@/app/admin/layout/data-table"
import { SectionCards } from "@/app/admin/layout/section-cards"
import data from "./data.json"
import { useEffect } from "react"
export default function Page() {
  useEffect(() => {
    document.title = 'Admin Dashboard'
  }, []);
    return (
        <div>

            <SectionCards />
            <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
        </div>
    )
}