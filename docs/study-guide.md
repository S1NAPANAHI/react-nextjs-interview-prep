# Full Stack React.js + Next.js Interview Crash Course 🚀

*A comprehensive 4-week intensive preparation program for landing your dream full-stack developer role*

## 📋 Table of Contents

1. [Course Overview](#course-overview)
2. [Prerequisites](#prerequisites)
3. [4-Week Study Plan](#4-week-study-plan)
4. [Week 1: React.js Mastery](#week-1-reactjs-mastery)
5. [Week 2: Next.js & Full-Stack Integration](#week-2-nextjs--full-stack-integration)
6. [Week 3: JavaScript & System Design](#week-3-javascript--system-design)
7. [Week 4: Interview Simulation](#week-4-interview-simulation)
8. [Essential Coding Challenges](#essential-coding-challenges)
9. [System Design Practice](#system-design-practice)
10. [Behavioral Interview Prep](#behavioral-interview-prep)
11. [Resources & References](#resources--references)

---

## 🎯 Course Overview

This crash course is designed for **intermediate to advanced developers** preparing for full-stack React.js + Next.js interviews at top tech companies. By the end of 4 weeks, you'll master:

- **React.js**: Hooks, patterns, optimization, testing
- **Next.js**: SSR/SSG, API routes, deployment, performance
- **JavaScript**: Core concepts, algorithms, async programming
- **System Design**: Architecture, scalability, trade-offs
- **Interview Skills**: Coding challenges, behavioral questions

### 🎖️ Success Metrics
- Complete 20+ coding challenges
- Build 3 full-stack projects
- Conduct 5+ mock interviews
- Design 2+ system architectures

---

## ✅ Prerequisites

**Required Skills:**
- JavaScript ES6+ fundamentals
- Basic React.js knowledge (components, props, state)
- Understanding of HTML, CSS
- Git version control
- Basic Node.js/npm knowledge

**Recommended Tools:**
- VS Code with React/Next.js extensions
- Node.js (v16+)
- Git and GitHub account
- Vercel account for deployment

---

## 📅 4-Week Study Plan

### Daily Schedule (11 hours/week)
- **Weekdays**: 1.5 hours/day (theory + practice)
- **Saturday**: 2 hours (project work)
- **Sunday**: 2 hours (review + mock interviews)

---

## 🔥 Week 1: React.js Mastery

### 🎯 Learning Objectives
- Master React fundamentals and advanced concepts
- Build reusable components and custom hooks
- Understand performance optimization techniques
- Write testable React code

### 📚 Day 1-2: React Fundamentals Review

**Topics to Cover:**
- React Virtual DOM and reconciliation process
- JSX syntax and component composition
- Props vs State management
- Class components vs Functional components
- Event handling and form management

**Coding Exercise: Build a User Profile Card**
```jsx
// UserProfile.jsx - Practice props, state, and event handling
const UserProfile = ({ user, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(user);

  const handleSave = () => {
    onEdit(userInfo);
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      {isEditing ? (
        <EditForm user={userInfo} onChange={setUserInfo} onSave={handleSave} />
      ) : (
        <ProfileView user={userInfo} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
};
```

**Interview Questions:**
1. Explain the Virtual DOM and its benefits
2. What's the difference between controlled and uncontrolled components?
3. When would you use a class component over a functional component?

### 📚 Day 3-4: React Hooks Deep Dive

**Topics to Cover:**
- useState, useEffect, useContext
- useCallback, useMemo, useReducer
- Custom hooks for reusable logic
- Hook rules and best practices

**Coding Exercise: Custom useApi Hook**
```jsx
// hooks/useApi.js - Reusable data fetching hook
const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
```

**Interview Questions:**
1. Explain the difference between useCallback and useMemo
2. When should you use useReducer over useState?
3. How do you handle cleanup in useEffect?

### 📚 Day 5-6: Advanced React Patterns

**Topics to Cover:**
- Context API for state management
- Error boundaries for error handling
- Higher-Order Components (HOCs)
- Render props pattern
- React.memo for performance optimization

**Coding Exercise: Theme Provider with Context API**
```jsx
// context/ThemeContext.js
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app ${theme}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### 📚 Day 7: Practice & Review

**Major Project: Todo App with Advanced Features**
- CRUD operations with local storage persistence
- Filtering and sorting functionality
- Drag-and-drop reordering
- Dark/light theme toggle
- Unit tests with React Testing Library

---

## ⚡ Week 2: Next.js & Full-Stack Integration

### 🎯 Learning Objectives
- Master Next.js routing and data fetching strategies
- Build full-stack applications with API routes
- Implement authentication and database integration
- Deploy production-ready applications

### 📚 Day 1-2: Next.js Fundamentals

**Topics to Cover:**
- File-based routing system
- Pages Router vs App Router
- Dynamic routes and nested layouts
- Link component and navigation
- Image optimization with next/image

**Coding Exercise: Blog with Dynamic Routing**
```jsx
// pages/blog/[slug].js
export async function getStaticPaths() {
  const posts = await getAllPosts();
  const paths = posts.map(post => ({
    params: { slug: post.slug }
  }));
  
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  
  return {
    props: { post },
    revalidate: 60 // ISR: revalidate every 60 seconds
  };
}

const BlogPost = ({ post }) => (
  <article>
    <Head>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
    </Head>
    <h1>{post.title}</h1>
    <div dangerouslySetInnerHTML={{ __html: post.content }} />
  </article>
);
```

### 📚 Day 3-4: Data Fetching & API Routes

**Topics to Cover:**
- getStaticProps vs getServerSideProps
- Incremental Static Regeneration (ISR)
- API routes and serverless functions
- Database integration with Prisma/MongoDB
- Middleware for request processing

**Coding Exercise: Authentication API**
```jsx
// pages/api/auth/login.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.setHeader('Set-Cookie', serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600,
      path: '/'
    }));

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}
```

### 📚 Day 5-6: Performance & Deployment

**Topics to Cover:**
- Code splitting and lazy loading
- SEO optimization and meta tags
- Performance monitoring
- Deployment to Vercel/Netlify
- Environment variables and secrets

**Coding Exercise: E-commerce Product Catalog**
- Static generation for product pages
- Server-side rendering for search results
- API routes for cart management
- Image optimization for product photos
- SEO metadata for all pages

---

## 🧠 Week 3: JavaScript & System Design

### 🎯 Learning Objectives
- Master JavaScript core concepts and async programming
- Practice common algorithms and data structures
- Design scalable system architectures
- Understand frontend and backend integration patterns

### 📚 Day 1-2: JavaScript Core Concepts

**Topics to Cover:**
- Closures, scope, and hoisting
- Promises, async/await, and error handling
- Event loop and concurrency model
- ES6+ features and modern JavaScript
- Module systems and bundling

**Coding Exercise: Implement Promise.all from Scratch**
```javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }

    const results = [];
    let completed = 0;

    if (promises.length === 0) {
      return resolve(results);
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(value => {
          results[index] = value;
          completed++;
          
          if (completed === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
}
```

---

## 📚 Resources & References

### Essential Documentation
- [React Documentation](https://react.dev/) - Official React docs with hooks
- [Next.js Documentation](https://nextjs.org/docs) - Complete Next.js guide
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Comprehensive JS docs

### Practice Platforms
- [LeetCode](https://leetcode.com/) - Algorithm and coding challenges
- [GreatFrontEnd](https://www.greatfrontend.com/) - Frontend interview preparation
- [Interviewing.io](https://interviewing.io/) - Mock technical interviews

### System Design Resources
- [System Design Primer](https://github.com/donnemartin/system-design-primer) - Comprehensive guide
- [High Scalability](http://highscalability.com/) - Real-world architecture examples

---

**Good luck with your interviews! Remember, preparation is the key to confidence, and confidence is the key to success. You've got this! 🚀**