import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen,
  Download,
  FileText,
  ExternalLink,
  Bookmark,
  Star,
  Clock
} from 'lucide-react'

const resourceCategories = [
  {
    title: 'Setup Guides',
    icon: FileText,
    color: 'text-blue-500',
    resources: [
      {
        name: 'MT4/MT5 Installation Guide',
        type: 'PDF',
        size: '2.3 MB',
        downloads: '1,247',
        rating: 4.8,
        description: 'Complete guide to installing and configuring MetaTrader platforms'
      },
      {
        name: 'EA Installation Tutorial', 
        type: 'PDF',
        size: '1.8 MB',
        downloads: '2,156',
        rating: 4.9,
        description: 'Step-by-step instructions for installing Expert Advisors'
      },
      {
        name: 'VPS Setup Manual',
        type: 'PDF', 
        size: '3.1 MB',
        downloads: '867',
        rating: 4.7,
        description: 'Guide to setting up Virtual Private Server for trading'
      }
    ]
  },
  {
    title: 'Documentation',
    icon: BookOpen,
    color: 'text-green-500',
    resources: [
      {
        name: 'API Documentation',
        type: 'Web',
        updated: '2 days ago',
        pages: '127',
        rating: 4.7,
        description: 'Complete API reference for developers and advanced users'
      },
      {
        name: 'Trading Strategies Guide',
        type: 'PDF',
        size: '4.2 MB',
        downloads: '3,445',
        rating: 4.9,
        description: 'Comprehensive guide to profitable trading strategies'
      },
      {
        name: 'Troubleshooting Manual',
        type: 'PDF',
        size: '2.7 MB', 
        downloads: '1,923',
        rating: 4.5,
        description: 'Solutions to common issues and error messages'
      }
    ]
  }
]

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'PDF':
      return <FileText className="h-4 w-4" />
    case 'Web':
      return <ExternalLink className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

const getResourceMeta = (resource: any) => {
  if (resource.size) return resource.size
  if (resource.duration) return resource.duration
  if (resource.pages) return `${resource.pages} pages`
  return 'Online'
}

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="dashboard-section-title flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          Resources
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Download guides, tutorials, and documentation to maximize your trading success
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4 animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
        <Card className="hover:shadow-lg transition-shadow hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">9</div>
            <p className="text-xs text-muted-foreground">Guides & tutorials</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">12.4k</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-primary">4.8</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              User rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resource Categories */}
      <div className="space-y-8 animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
        {resourceCategories.map((category, categoryIndex) => (
          <Card key={category.title} className={`hover:shadow-lg transition-shadow animate-fade-in opacity-0 [animation-fill-mode:forwards]`}
                style={{ animationDelay: `${0.3 + categoryIndex * 0.1}s` }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <category.icon className={`h-6 w-6 ${category.color}`} />
                {category.title}
              </CardTitle>
              <CardDescription>
                Essential {category.title.toLowerCase()} for your trading journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {category.resources.map((resource, resourceIndex) => (
                  <div key={resourceIndex} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-background border flex items-center justify-center">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{resource.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{getResourceMeta(resource)}</span>
                          {resource.downloads && (
                            <span className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {resource.downloads}
                            </span>
                          )}
                          {resource.views && (
                            <span>{resource.views} views</span>
                          )}
                          {resource.updated && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {resource.updated}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {resource.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="hover-scale">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="hover-scale">
                        <Download className="h-4 w-4 mr-2" />
                        {resource.type === 'Web' ? 'View' : 'Download'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}