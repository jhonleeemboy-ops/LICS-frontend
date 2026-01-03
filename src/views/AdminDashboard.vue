<template>
  <div class="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
    <!-- Top Navigation -->
    <div class="bg-gradient-to-r from-amber-900 to-amber-800 text-white px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-amber-700 w-10 h-10 rounded-lg flex items-center justify-center">
            <font-awesome-icon icon="scale-balanced" class="text-xl" />
          </div>
          <div>
            <h1 class="text-base font-bold">Butuan City Legal Information System</h1>
            <p class="text-xs text-amber-200">Administrator Dashboard</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="text-right hidden md:block">
            <p class="text-xs text-amber-200">Welcome, Admin</p>
            <p class="text-sm font-medium">{{ user?.name || 'Administrator' }}</p>
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              @click="activeTab = 'dashboard'"
              class="p-2 hover:bg-amber-700/50 rounded-lg transition-colors"
              title="Dashboard"
            >
              <font-awesome-icon icon="gauge-high" />
            </button>
            
            <button 
              @click="handleLogout"
              class="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              title="Logout"
            >
              <font-awesome-icon icon="right-from-bracket" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Navigation -->
    <div class="bg-white shadow-md border-b border-amber-200">
      <div class="flex overflow-x-auto px-4">
        <button 
          v-for="tab in adminTabs" 
          :key="tab.id"
          :class="[
            'py-3 px-4 font-medium flex items-center gap-2 transition-colors whitespace-nowrap',
            activeTab === tab.id 
              ? 'text-amber-700 border-b-2 border-amber-700 bg-amber-50' 
              : 'text-amber-900 hover:text-amber-700 hover:bg-amber-50'
          ]"
          @click="activeTab = tab.id"
        >
          <font-awesome-icon :icon="tab.icon" />
          <span>{{ tab.name }}</span>
          <span v-if="tab.count !== undefined" 
            :class="[
              'text-xs rounded-full px-2 py-0.5',
              activeTab === tab.id 
                ? 'bg-amber-700 text-white' 
                : 'bg-amber-100 text-amber-800'
            ]">
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="px-4 py-6 max-w-7xl mx-auto">
      <!-- Dashboard Overview -->
      <div v-if="activeTab === 'dashboard'" class="space-y-6">
        <!-- Welcome Banner -->
        <div class="bg-gradient-to-r from-amber-800 to-amber-700 text-white rounded-2xl p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold mb-2">Welcome back, Admin</h2>
              <p class="text-amber-100">Manage Butuan City ordinances and legal information</p>
            </div>
            <div class="hidden md:flex items-center gap-2">
              <span class="text-amber-300 text-sm">
                Last login: {{ lastLoginTime }}
              </span>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Ordinances Card -->
          <div class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-amber-700">Total Ordinances</p>
                <p class="text-2xl font-bold text-amber-900 mt-1">{{ ordinanceStore.ordinances.length }}</p>
              </div>
              <div class="bg-amber-100 p-3 rounded-lg">
                <font-awesome-icon icon="file-lines" class="text-amber-600 text-xl" />
              </div>
            </div>
            <p class="text-xs text-amber-600 mt-3">
              <span class="text-green-600 font-medium">{{ ordinanceStore.activeOrdinances.length }} active</span>
              • {{ ordinanceStore.draftOrdinances.length }} drafts
            </p>
          </div>

          <!-- Total Views Card -->
          <div class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-amber-700">Total Views</p>
                <p class="text-2xl font-bold text-amber-900 mt-1">{{ totalViews }}</p>
              </div>
              <div class="bg-amber-100 p-3 rounded-lg">
                <font-awesome-icon icon="eye" class="text-amber-600 text-xl" />
              </div>
            </div>
            <p class="text-xs text-amber-600 mt-3">
              Most viewed: {{ popularOrdinance.title }}
            </p>
          </div>

          <!-- Categories Card -->
          <div class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-amber-700">Categories</p>
                <p class="text-2xl font-bold text-amber-900 mt-1">{{ ordinanceStore.categories.length }}</p>
              </div>
              <div class="bg-amber-100 p-3 rounded-lg">
                <font-awesome-icon icon="tags" class="text-amber-600 text-xl" />
              </div>
            </div>
            <p class="text-xs text-amber-600 mt-3">
              Most used: {{ mostUsedCategory }}
            </p>
          </div>

          <!-- Recent Activity Card -->
          <div class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-amber-700">Recent Activity</p>
                <p class="text-2xl font-bold text-amber-900 mt-1">{{ recentOrdinancesCount }}</p>
              </div>
              <div class="bg-amber-100 p-3 rounded-lg">
                <font-awesome-icon icon="clock" class="text-amber-600 text-xl" />
              </div>
            </div>
            <p class="text-xs text-amber-600 mt-3">
              Updated in last 7 days
            </p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            @click="modalStore.openOrdinanceModal()"
            class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-all hover:border-amber-400 group"
          >
            <div class="flex items-center gap-4">
              <div class="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors">
                <font-awesome-icon icon="file-circle-plus" class="text-amber-600 text-xl" />
              </div>
              <div class="text-left">
                <h4 class="font-bold text-amber-900">Add New Ordinance</h4>
                <p class="text-sm text-amber-600 mt-1">Create a new legal ordinance</p>
              </div>
            </div>
          </button>

          <button 
            @click="modalStore.openAddCategoryModal()"
            class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-all hover:border-amber-400 group"
          >
            <div class="flex items-center gap-4">
              <div class="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors">
                <font-awesome-icon icon="folder-plus" class="text-amber-600 text-xl" />
              </div>
              <div class="text-left">
                <h4 class="font-bold text-amber-900">Manage Categories</h4>
                <p class="text-sm text-amber-600 mt-1">Add or edit ordinance categories</p>
              </div>
            </div>
          </button>

          <button 
            @click="activeTab = 'ordinances'"
            class="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-all hover:border-amber-400 group"
          >
            <div class="flex items-center gap-4">
              <div class="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors">
                <font-awesome-icon icon="chart-bar" class="text-amber-600 text-xl" />
              </div>
              <div class="text-left">
                <h4 class="font-bold text-amber-900">View Analytics</h4>
                <p class="text-sm text-amber-600 mt-1">Check ordinance performance</p>
              </div>
            </div>
          </button>
        </div>

        <!-- Recent Ordinances & Popular Ordinances -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Ordinances -->
          <div class="bg-white rounded-xl shadow-sm border border-amber-200">
            <div class="p-6 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100">
              <h3 class="text-lg font-bold text-amber-900">Recent Ordinances</h3>
              <p class="text-sm text-amber-600 mt-1">Recently added or updated</p>
            </div>
            <div class="p-4">
              <div v-if="ordinanceStore.recentOrdinances.length === 0" class="text-center py-8">
                <font-awesome-icon icon="inbox" class="text-4xl text-amber-300 mb-3" />
                <p class="text-amber-600">No recent ordinances</p>
              </div>
              
              <div v-else class="space-y-3">
                <div 
                  v-for="ordinance in ordinanceStore.recentOrdinances" 
                  :key="ordinance.id"
                  class="p-3 border border-amber-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors cursor-pointer"
                  @click="modalStore.openViewOrdinanceModal(ordinance)"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h4 class="font-medium text-amber-900">{{ ordinance.title }}</h4>
                      <p class="text-xs text-amber-600 mt-1">{{ ordinance.ordinanceNumber }}</p>
                    </div>
                    <span :class="getStatusClass(ordinance.status)" 
                      class="text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap">
                      {{ ordinance.status }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-xs text-amber-700">{{ ordinance.category }}</span>
                    <span class="text-xs text-amber-600">{{ ordinance.lastUpdated }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-4 border-t border-amber-200">
              <button 
                @click="activeTab = 'ordinances'"
                class="w-full py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg font-medium transition-colors"
              >
                View All Ordinances
              </button>
            </div>
          </div>

          <!-- Popular Ordinances -->
          <div class="bg-white rounded-xl shadow-sm border border-amber-200">
            <div class="p-6 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100">
              <h3 class="text-lg font-bold text-amber-900">Popular Ordinances</h3>
              <p class="text-sm text-amber-600 mt-1">Most viewed by users</p>
            </div>
            <div class="p-4">
              <div v-if="ordinanceStore.popularOrdinances.length === 0" class="text-center py-8">
                <font-awesome-icon icon="chart-line" class="text-4xl text-amber-300 mb-3" />
                <p class="text-amber-600">No popular ordinances yet</p>
              </div>
              
              <div v-else class="space-y-3">
                <div 
                  v-for="ordinance in ordinanceStore.popularOrdinances" 
                  :key="ordinance.id"
                  class="p-3 border border-amber-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors cursor-pointer"
                  @click="modalStore.openViewOrdinanceModal(ordinance)"
                >
                  <div class="flex items-center justify-between">
                    <h4 class="font-medium text-amber-900">{{ ordinance.title }}</h4>
                    <span class="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      {{ ordinance.views }} views
                    </span>
                  </div>
                  <p class="text-sm text-amber-700 mt-2 line-clamp-2">{{ ordinance.description }}</p>
                  <div class="flex items-center justify-between mt-3">
                    <span class="text-xs text-amber-600">{{ ordinance.category }}</span>
                    <div class="flex gap-2">
                      <span v-for="tag in ordinance.tags.slice(0, 2)" :key="tag" 
                        class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Categories Overview -->
        <div class="bg-white rounded-xl shadow-sm border border-amber-200">
          <div class="p-6 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-bold text-amber-900">Categories Overview</h3>
                <p class="text-sm text-amber-600 mt-1">Ordinances by category</p>
              </div>
              <button 
                @click="modalStore.openAddCategoryModal()"
                class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <font-awesome-icon icon="plus" />
                <span>Add Category</span>
              </button>
            </div>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="[category, count] in Object.entries(ordinanceStore.ordinanceCountByCategory)" 
                :key="category"
                class="p-4 border border-amber-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-colors cursor-pointer"
                @click="filterByCategory(category)"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="font-medium text-amber-900">{{ category }}</h4>
                  <span class="bg-amber-100 text-amber-800 text-sm font-medium px-2 py-1 rounded-full">
                    {{ count }}
                  </span>
                </div>
                <div class="w-full bg-amber-200 rounded-full h-2">
                  <div 
                    :style="{ width: `${(count / maxOrdinanceCount) * 100}%` }"
                    class="bg-amber-600 h-2 rounded-full"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ordinances Management -->
      <div v-if="activeTab === 'ordinances'" class="space-y-6">
        <!-- Header -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 class="text-2xl font-bold text-amber-900">Ordinances Management</h3>
              <p class="text-amber-700 mt-1">Manage all city ordinances and regulations</p>
            </div>
            <div class="flex gap-3">
              <button 
                @click="modalStore.openOrdinanceModal()"
                class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <font-awesome-icon icon="plus" />
                <span>Add New Ordinance</span>
              </button>
            </div>
          </div>
          
          <!-- Filters -->
          <div class="mt-6 flex flex-wrap gap-3">
            <button 
              v-for="filter in filters" 
              :key="filter.id"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                activeFilter === filter.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              ]"
              @click="activeFilter = filter.id"
            >
              {{ filter.name }}
              <span v-if="filter.count" class="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {{ filter.count }}
              </span>
            </button>
          </div>
        </div>

        <!-- Ordinances List -->
        <div class="bg-white rounded-xl shadow-sm border border-amber-200">
          <!-- Search and Actions -->
          <div class="p-4 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100">
            <div class="flex flex-col md:flex-row gap-3">
              <div class="flex-1 relative">
                <font-awesome-icon icon="search" class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search ordinances by title, number, or content..."
                  class="w-full pl-12 pr-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                />
              </div>
              <select 
                v-model="selectedCategoryFilter"
                class="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
              >
                <option value="">All Categories</option>
                <option v-for="category in ordinanceStore.categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>

          <!-- Ordinances Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-amber-50">
                <tr>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-amber-900">Title</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-amber-900">Category</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-amber-900">Status</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-amber-900">Views</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-amber-900">Last Updated</th>
                  <th class="py-3 px-4 text-left text-sm font-semibold text-amber-900">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-amber-200">
                <tr v-for="ordinance in filteredOrdinances" :key="ordinance.id" class="hover:bg-amber-50">
                  <td class="py-3 px-4">
                    <div>
                      <h4 class="font-medium text-amber-900">{{ ordinance.title }}</h4>
                      <p class="text-xs text-amber-600">{{ ordinance.ordinanceNumber }}</p>
                    </div>
                  </td>
                  <td class="py-3 px-4">
                    <span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                      {{ ordinance.category }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <span :class="getStatusClass(ordinance.status)" 
                      class="px-3 py-1 rounded-full text-sm font-medium">
                      {{ ordinance.status }}
                    </span>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <font-awesome-icon icon="eye" class="text-amber-500" />
                      <span class="font-medium text-amber-700">{{ ordinance.views }}</span>
                    </div>
                  </td>
                  <td class="py-3 px-4 text-amber-600">{{ ordinance.lastUpdated }}</td>
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-2">
                      <button 
                        @click="modalStore.openViewOrdinanceModal(ordinance)"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View"
                      >
                        <font-awesome-icon icon="eye" />
                      </button>
                      <button 
                        @click="modalStore.openOrdinanceModal(ordinance)"
                        class="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Edit"
                      >
                        <font-awesome-icon icon="pen-to-square" />
                      </button>
                      <button 
                        @click="deleteOrdinance(ordinance.id)"
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <font-awesome-icon icon="trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="filteredOrdinances.length === 0" class="text-center py-12">
            <font-awesome-icon icon="file-circle-question" class="text-5xl text-amber-300 mb-3" />
            <p class="text-amber-600 text-lg">No ordinances found</p>
            <p class="text-amber-500 text-sm mt-1">Try changing your search or filters</p>
            <button 
              @click="modalStore.openOrdinanceModal()"
              class="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center gap-2 mx-auto"
            >
              <font-awesome-icon icon="plus" />
              <span>Add Your First Ordinance</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Categories Management -->
      <div v-if="activeTab === 'categories'" class="space-y-6">
        <!-- Header -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 class="text-2xl font-bold text-amber-900">Categories Management</h3>
              <p class="text-amber-700 mt-1">Manage ordinance categories</p>
            </div>
            <button 
              @click="modalStore.openAddCategoryModal()"
              class="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium flex items-center gap-2"
            >
              <font-awesome-icon icon="plus" />
              <span>Add New Category</span>
            </button>
          </div>
        </div>

        <!-- Categories Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="category in ordinanceStore.categories" 
            :key="category"
            class="bg-white rounded-xl p-6 shadow-sm border border-amber-200 hover:border-amber-400 transition-colors"
          >
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-bold text-amber-900">{{ category }}</h4>
              <span class="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
                {{ ordinanceStore.ordinanceCountByCategory[category] || 0 }}
              </span>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-amber-600">Active Ordinances</span>
                <span class="font-medium text-green-600">
                  {{ getActiveOrdinancesCount(category) }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-amber-600">Total Views</span>
                <span class="font-medium text-blue-600">
                  {{ getCategoryViews(category) }}
                </span>
              </div>
            </div>

            <div class="mt-4 flex gap-2">
              <button 
                @click="editCategory(category)"
                class="flex-1 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg font-medium transition-colors"
              >
                Edit
              </button>
              <button 
                @click="deleteCategory(category)"
                :disabled="ordinanceStore.ordinanceCountByCategory[category] > 0"
                class="flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics -->
      <div v-if="activeTab === 'analytics'" class="space-y-6">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-amber-900">Analytics Dashboard</h3>
              <p class="text-amber-700 mt-1">Ordinance performance and user insights</p>
            </div>
            <select class="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>All time</option>
            </select>
          </div>
          
          <!-- Analytics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
              <div class="flex items-center gap-4">
                <div class="bg-amber-600 p-3 rounded-lg">
                  <font-awesome-icon icon="users" class="text-white text-xl" />
                </div>
                <div>
                  <p class="text-sm text-amber-600">Active Users</p>
                  <p class="text-2xl font-bold text-amber-900">1,247</p>
                </div>
              </div>
              <p class="text-xs text-amber-600 mt-3">↑ 12% from last week</p>
            </div>
            
            <div class="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
              <div class="flex items-center gap-4">
                <div class="bg-amber-600 p-3 rounded-lg">
                  <font-awesome-icon icon="message" class="text-white text-xl" />
                </div>
                <div>
                  <p class="text-sm text-amber-600">Chatbot Queries</p>
                  <p class="text-2xl font-bold text-amber-900">3,458</p>
                </div>
              </div>
              <p class="text-xs text-amber-600 mt-3">↑ 24% from last week</p>
            </div>
            
            <div class="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
              <div class="flex items-center gap-4">
                <div class="bg-amber-600 p-3 rounded-lg">
                  <font-awesome-icon icon="file-contract" class="text-white text-xl" />
                </div>
                <div>
                  <p class="text-sm text-amber-600">Ordinance Clicks</p>
                  <p class="text-2xl font-bold text-amber-900">8,923</p>
                </div>
              </div>
              <p class="text-xs text-amber-600 mt-3">↑ 18% from last week</p>
            </div>
          </div>
          
          <!-- Coming Soon -->
          <div class="mt-8 p-8 bg-gradient-to-r from-amber-800 to-amber-700 rounded-xl text-center">
            <font-awesome-icon icon="chart-line" class="text-amber-200 text-5xl mb-4" />
            <h4 class="text-xl font-bold text-white mb-2">Advanced Analytics Coming Soon</h4>
            <p class="text-amber-200">Detailed charts and insights are being developed to help you understand ordinance usage patterns.</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Components -->
    <OrdinanceModal />
    <AddCategoryModal />
    <ViewOrdinanceModal />

    <!-- Help Button -->
    <button class="fixed bottom-6 right-6 w-12 h-12 bg-amber-800 hover:bg-amber-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-50">
      <font-awesome-icon icon="question" class="text-xl" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useOrdinanceStore } from '@/stores/ordinance'
import { useModalStore } from '@/stores/modal'
import { useRouter } from 'vue-router'
import OrdinanceModal from '@/components/clients/OrdinanceModal.vue'
import AddCategoryModal from '@/components/clients/AddCategoryModal.vue'
import ViewOrdinanceModal from '@/components/clients/ViewOrdinanceModal.vue'

const authStore = useAuthStore()
const ordinanceStore = useOrdinanceStore()
const modalStore = useModalStore()
const router = useRouter()

const user = ref(null)
const activeTab = ref('dashboard')
const activeFilter = ref('all')
const searchQuery = ref('')
const selectedCategoryFilter = ref('')

const adminTabs = computed(() => [
  { id: 'dashboard', name: 'Dashboard', icon: 'gauge-high' },
  { id: 'ordinances', name: 'Ordinances', icon: 'file-lines', count: ordinanceStore.ordinances.length },
  { id: 'categories', name: 'Categories', icon: 'tags', count: ordinanceStore.categories.length },
  { id: 'analytics', name: 'Analytics', icon: 'chart-simple' }
])

const filters = computed(() => [
  { id: 'all', name: 'All Ordinances', count: ordinanceStore.ordinances.length },
  { id: 'active', name: 'Active', count: ordinanceStore.activeOrdinances.length },
  { id: 'draft', name: 'Drafts', count: ordinanceStore.draftOrdinances.length }
])

const totalViews = computed(() => {
  return ordinanceStore.ordinances.reduce((sum, ord) => sum + ord.views, 0)
})

const popularOrdinance = computed(() => {
  return ordinanceStore.popularOrdinances[0] || { title: 'None', views: 0 }
})

const mostUsedCategory = computed(() => {
  const counts = ordinanceStore.ordinanceCountByCategory
  const max = Math.max(...Object.values(counts))
  return Object.keys(counts).find(key => counts[key] === max) || 'None'
})

const recentOrdinancesCount = computed(() => {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  return ordinanceStore.ordinances.filter(ord => 
    new Date(ord.lastUpdated) >= sevenDaysAgo
  ).length
})

const lastLoginTime = computed(() => {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})

const maxOrdinanceCount = computed(() => {
  return Math.max(...Object.values(ordinanceStore.ordinanceCountByCategory), 1)
})

const filteredOrdinances = computed(() => {
  let filtered = ordinanceStore.ordinances

  // Apply status filter
  if (activeFilter.value === 'active') {
    filtered = filtered.filter(ord => ord.status === 'active')
  } else if (activeFilter.value === 'draft') {
    filtered = filtered.filter(ord => ord.status === 'draft')
  }

  // Apply category filter
  if (selectedCategoryFilter.value) {
    filtered = filtered.filter(ord => ord.category === selectedCategoryFilter.value)
  }

  // Apply search
  if (searchQuery.value) {
    filtered = ordinanceStore.searchOrdinances(searchQuery.value)
  }

  return filtered
})

onMounted(() => {
  user.value = authStore.user
  // Redirect if not admin
  if (user.value?.role !== 'admin') {
    router.push('/login')
  }
})

const getStatusClass = (status) => {
  const classes = {
    'active': 'bg-green-100 text-green-800',
    'draft': 'bg-yellow-100 text-yellow-800',
    'archived': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getActiveOrdinancesCount = (category) => {
  return ordinanceStore.ordinances.filter(ord => 
    ord.category === category && ord.status === 'active'
  ).length
}

const getCategoryViews = (category) => {
  return ordinanceStore.ordinances
    .filter(ord => ord.category === category)
    .reduce((sum, ord) => sum + ord.views, 0)
}

const deleteOrdinance = (ordinanceId) => {
  if (confirm('Are you sure you want to delete this ordinance? This action cannot be undone.')) {
    ordinanceStore.deleteOrdinance(ordinanceId)
  }
}

const editCategory = (category) => {
  const newName = prompt('Enter new category name:', category)
  if (newName && newName !== category) {
    // Update ordinances with the new category name
    ordinanceStore.ordinances.forEach(ord => {
      if (ord.category === category) {
        ord.category = newName
      }
    })
    // Update categories list
    const index = ordinanceStore.categories.indexOf(category)
    if (index !== -1) {
      ordinanceStore.categories[index] = newName
    }
  }
}

const deleteCategory = (category) => {
  if (ordinanceStore.ordinanceCountByCategory[category] > 0) {
    alert('Cannot delete category that has ordinances assigned. Please reassign or delete those ordinances first.')
    return
  }
  
  if (confirm(`Are you sure you want to delete the "${category}" category?`)) {
    const index = ordinanceStore.categories.indexOf(category)
    if (index !== -1) {
      ordinanceStore.categories.splice(index, 1)
    }
  }
}

const filterByCategory = (category) => {
  activeTab.value = 'ordinances'
  selectedCategoryFilter.value = category
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #fef3c7;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #d97706;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b45309;
}

/* Smooth transitions */
.border-amber-200 {
  transition: border-color 0.2s ease;
}

.hover\:border-amber-400:hover {
  border-color: #fbbf24;
}

.hover\:bg-amber-50:hover {
  background-color: #fffbeb;
}

.hover\:bg-amber-200:hover {
  background-color: #fde68a;
}
</style>