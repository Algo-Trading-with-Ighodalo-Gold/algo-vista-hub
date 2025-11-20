import { useMemo, useState } from "react"
import { BookOpen, Code, Terminal, Database, Settings, Rocket, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal"

const docCategories = [
  {
    icon: Rocket,
    title: "Getting Started",
    description: "Start building with our APIs",
    color: "text-blue-500",
    count: "5 guides"
  },
  {
    icon: Code,
    title: "API Reference",
    description: "Complete API documentation",
    color: "text-green-500",
    count: "25 endpoints"
  },
  {
    icon: Settings,
    title: "Configuration",
    description: "Set up your environment",
    color: "text-purple-500",
    count: "10 guides"
  },
  {
    icon: Database,
    title: "Data Models",
    description: "Understand our data structures",
    color: "text-orange-500",
    count: "15 models"
  }
]

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return docCategories

    return docCategories.filter(category =>
      category.title.toLowerCase().includes(term) ||
      category.description.toLowerCase().includes(term)
    )
  }, [searchTerm])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-subtle border-b py-20">
        <div className="container relative py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <ScrollReveal direction="up" delay={0.1}>
              <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-hero">API Documentation</h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <p className="mt-4 text-lg leading-7 text-muted-foreground max-w-2xl mx-auto">
                Everything you need to integrate with Algo Trading with Ighodalo
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.4}>
              <div className="mt-8 relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search documentation..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {searchTerm && filteredCategories.length === 0 && (
                <p className="mt-4 text-sm text-muted-foreground">
                  No documentation matches “{searchTerm}”.
                </p>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <ScrollReveal direction="up">
            <h2 className="text-3xl font-bold text-center mb-4">Quick Start</h2>
            <p className="text-center text-muted-foreground mb-12">
              Get up and running in 5 minutes
            </p>
          </ScrollReveal>

          <Card className="p-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5 text-primary" />
                Install SDK
              </CardTitle>
            </CardHeader>
            <CardContent>
              <code className="block p-4 bg-muted rounded-lg text-sm">
                npm install @algotradingwithighodalo/sdk
              </code>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <ScrollReveal direction="up">
            <h2 className="text-3xl font-bold text-center mb-16">Documentation</h2>
          </ScrollReveal>

          {filteredCategories.length === 0 ? (
            <Card className="max-w-2xl mx-auto text-center p-10">
              <CardHeader>
                <CardTitle>No documentation found</CardTitle>
                <CardDescription>
                  Try adjusting your search or browse all documentation categories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear search
                </Button>
              </CardContent>
            </Card>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {filteredCategories.map((category, index) => (
              <StaggerItem key={index} direction={index % 2 === 0 ? 'left' : 'right'}>
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full">
                  <CardHeader>
                    <category.icon className={`h-12 w-12 ${category.color} mb-4`} />
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{category.count}</Badge>
                  </CardContent>
                </Card>
              </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </div>
  )
}

