"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Sparkles,
  FileText,
  MessageSquare,
  GitBranch,
  Mic,
  ArrowRight,
  Users,
  Zap,
  Shield,
  Code,
  Brain,
  Play,
} from "lucide-react";

import logo from "@/assets/logo.png";
import title from "@/assets/title.png";
import Image from "next/image";
import Link from "next/link";

const GitWitHero = () => {
  const isAuthenticated = false;

  const features = [
    {
      icon: Github,
      title: "Repository Analysis",
      description:
        "Upload your GitHub URL and let GitWit analyze every file in your repository with AI-powered summarization.",
    },
    {
      icon: Brain,
      title: "Vector Embeddings",
      description:
        "Advanced vector embeddings store and contextualize your entire codebase for intelligent querying.",
    },
    {
      icon: GitBranch,
      title: "Commit Intelligence",
      description:
        "Automatically track and summarize recent commits with detailed change analysis and impact assessment.",
    },
    {
      icon: MessageSquare,
      title: "Smart Q&A",
      description:
        "Ask questions about your codebase and get intelligent answers with relevant file references.",
    },
    {
      icon: FileText,
      title: "File Mapping",
      description:
        "Comprehensive file analysis and mapping to understand project structure and dependencies.",
    },
    {
      icon: Mic,
      title: "Meeting Transcription",
      description:
        "Upload meeting recordings for AI-powered transcription and topic classification with Assembly AI.",
    },
  ];

  const stats = [
    { number: "98%", label: "Accuracy Rate" },
    { number: "< 30s", label: "Average Response Time" },
  ];

  return (
    <div className="bg-secondary min-h-screen">
      <nav className="bg-secondary border-border sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Image src={logo} alt="GitWit Logo" className="h-12 w-12" />
                <Image src={title} alt="GitWit title" className="h-20 w-20" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Button size="lg">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/sign-in">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button size="lg">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-4xl">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="mr-2 h-4 w-4" />
              Powered by Google Gemini AI
            </Badge>

            <h1 className="text-foreground mb-6 text-5xl font-bold md:text-7xl">
              Understand Any
              <span className="text-primary block">Codebase Instantly</span>
            </h1>

            <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl leading-relaxed md:text-2xl">
              GitWit helps young developers decode complex repositories using
              AI. Upload any GitHub project and get instant insights, summaries,
              and intelligent answers.
            </p>

            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="px-8 py-4 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Start Analyzing
              </Button>
            </div>

            <div className="mt-16 flex flex-row items-center justify-center gap-20">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-primary mb-2 text-3xl font-bold md:text-4xl">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              <Zap className="mr-2 h-4 w-4" />
              Powerful Features
            </Badge>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              Everything you need to
              <span className="text-primary"> master any codebase</span>
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              From repository analysis to intelligent Q&A, GitWit provides
              comprehensive tools for understanding complex software projects.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="bg-primary/10 group-hover:bg-primary/15 mb-4 flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                    <feature.icon className="text-primary h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              <Users className="mr-2 h-4 w-4" />
              Simple Process
            </Badge>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              Get started in
              <span className="text-primary"> 3 easy steps</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold">
                1
              </div>
              <h3 className="mb-4 text-xl font-semibold">Upload Repository</h3>
              <p className="text-muted-foreground">
                Paste your GitHub URL and access token for private repos. GitWit
                will fetch and analyze your entire project.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold">
                2
              </div>
              <h3 className="mb-4 text-xl font-semibold">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI processes every file, creates vector embeddings, and
                analyzes recent commits for comprehensive understanding.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold">
                3
              </div>
              <h3 className="mb-4 text-xl font-semibold">Ask Questions</h3>
              <p className="text-muted-foreground">
                Get instant answers about your codebase with relevant file
                references and detailed explanations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6">
            <Shield className="mr-2 h-4 w-4" />
            Secure & Private
          </Badge>

          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Ready to understand
            <span className="text-primary"> any codebase?</span>
          </h2>

          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            Join thousands of developers who are using GitWit to master complex
            repositories and accelerate their learning.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="px-8 py-4 text-lg">
              <Play className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-border border-t py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center space-x-2 md:mb-0">
              <Image src={logo} alt="GitWit Logo" className="h-12 w-12" />
              <Image src={title} alt="GitWit title" className="h-20 w-20" />
            </div>

            <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 text-sm">
              <span>
                © 2025 GitWit. Helping developers understand code better.
              </span>
              <span>
                Made by{" "}
                <a
                  href="https://portfolio-snowy-beta-66.vercel.app/"
                  className="text-gray-400 transition-all hover:underline"
                >
                  Spandan Mozumder
                </a>{" "}
                with lots of ❤️ and ☕️
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GitWitHero;
