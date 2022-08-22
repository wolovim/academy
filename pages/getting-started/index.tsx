import Head from 'next/head'
import NextLink from 'next/link'
import {
  Heading,
  Flex,
  Stack,
  Button,
  Text,
  Image,
  UnorderedList,
  ListItem,
  Link,
} from '@chakra-ui/react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface LessonProps {
  lessons: {
    frontMatter: any
    slug: string
  }[]
}

const GettingStarted: React.FC<LessonProps> = ({ lessons }) => {
  return (
    <>
      <Head>
        <title>D_D School of Code</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex as="main" py={5} px={[4, 10, 16]} direction="column" minH="100vh">
        <Stack spacing={5} direction="column">
          <Heading
            as="h2"
            fontSize="3xl"
            textAlign="center"
            color="#F96C9D"
            apply="mdx.h2"
          >
            Getting Started
          </Heading>

          <Heading
            apply="mdx.h3"
            as="h3"
            fontSize="2xl"
            textAlign="center"
            p={5}
          >
            What is School of Code?
          </Heading>
          <Text apply="mdx.p" as="p" fontSize="xl">
            &quot;School of Code&quot; is an open-source education platform
            created by the Developer DAO.
          </Text>
          <Text apply="mdx.p" as="p" fontSize="xl">
            We seek to{' '}
            {/* <Text fontWeight="bold" as="strong" color="#F96C9D">
              empower learners
            </Text>{' '} */}
            with knowledge and tools that can be applied to real-world projects
            while promoting a healthy learning environment.
          </Text>

          <Heading
            apply="mdx.h3"
            as="h3"
            fontSize="2xl"
            textAlign="center"
            p={5}
          >
            Current Lessons
          </Heading>

          <Text apply="mdx.p" as="p" fontSize="xl">
            Here are our{' '}
            <Text fontWeight="bold" as="strong" color="#F96C9D">
              current lessons
            </Text>
            .
          </Text>

          <Text apply="mdx.div" as="div" fontSize="xl">
            <UnorderedList>
              {lessons.map((lesson: any, idx: number) => (
                <ListItem key={lesson.slug}>
                  <NextLink href={'/lessons/' + lesson.slug} passHref>
                    <Link>
                      <Button>
                        Lesson&nbsp;{lesson.slug}:&nbsp;
                        {lesson.frontMatter.title}
                      </Button>
                    </Link>
                  </NextLink>
                </ListItem>
              ))}
            </UnorderedList>
          </Text>

          <Heading
            apply="mdx.h3"
            as="h3"
            fontSize="2xl"
            textAlign="center"
            p={5}
          >
            This project is just getting started.
          </Heading>

          <Text apply="mdx.div" as="div" fontSize="xl">
            <UnorderedList>
              <ListItem>
                We&apos;re looking for{' '}
                <Text fontWeight="bold" as="strong" color="#F96C9D">
                  feedback
                </Text>{' '}
                about this project and our current lessons.{' '}
                <NextLink
                  href={
                    'https://github.com/Developer-DAO/school-of-code/issues/new?assignees=&labels=needs+triage%2C+bug&template=bug_report.md&title='
                  }
                  passHref
                >
                  <Link isExternal textDecoration="underline">
                    Submit your suggestion or bug report.
                  </Link>
                </NextLink>
              </ListItem>
              <ListItem>
                We&apos;re also looking for{' '}
                <Text fontWeight="bold" as="strong" color="#F96C9D">
                  Developer DAO members
                </Text>{' '}
                who are interested in writing lesson content, or building
                website and blockchain features. The team can be found in the
                Developer DAO Discord{' '}
                <Text fontWeight="bold" as="strong">
                  #school-of-code
                </Text>{' '}
                channel.
              </ListItem>
            </UnorderedList>
          </Text>

          <Text apply="mdx.p" as="p" fontSize="xl">
            Read more at{' '}
            <NextLink href="https://ddschoolofcode.arweave.dev/" passHref>
              <Link isExternal textDecoration="underline">
                ddschoolofcode.arweave.dev
              </Link>
            </NextLink>
            .
          </Text>

          <Heading
            apply="mdx.h3"
            as="h3"
            fontSize="2xl"
            textAlign="center"
            p={5}
          >
            Highlights of Resources
          </Heading>
          <Image
            src="/assets/getting-started/img_1.png"
            alt="highlights of resources"
          />

          <Heading
            apply="mdx.h3"
            as="h3"
            fontSize="2xl"
            textAlign="center"
            p={5}
          >
            Roadmap
          </Heading>
          <Image
            src="/assets/getting-started/img_2.png"
            alt="3 month roadmap"
          />
        </Stack>
      </Flex>
    </>
  )
}

export default GettingStarted

export const getStaticProps = async () => {
  const files = fs.readdirSync(path.join('lessons'))
  const lessons = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join('lessons', filename),
      'utf-8',
    )
    const { data: frontMatter } = matter(markdownWithMeta)
    return {
      frontMatter,
      slug: filename.split('.')[0],
    }
  })
  return {
    props: {
      lessons,
    },
  }
}
